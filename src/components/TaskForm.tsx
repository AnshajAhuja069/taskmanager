import { useForm } from 'react-hook-form';
import { Task, TaskCategory, TaskStatus } from '../types/task';
import { Button } from './ui/Button';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useState } from 'react';

interface TaskFormProps {
  onSubmit: (data: Partial<Task>) => void;
  onCancel: () => void;
  initialData?: Partial<Task>;
}

export function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<Partial<Task>>({
    defaultValues: {
      ...initialData,
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : undefined
    },
  });

  const [attachments, setAttachments] = useState<File[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
      'application/pdf': [],
    },
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      setAttachments([...attachments, ...acceptedFiles]);
    },
  });

  const handleFormSubmit = (data: Partial<Task>) => {
    onSubmit({
      ...data,
      dueDate: new Date(data.dueDate as string),
      attachments: attachments.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }))
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          {...register('title', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Task title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">Title is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Task description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            {...register('category', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="WORK">Work</option>
            <option value="PERSONAL">Personal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            {...register('dueDate', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          {...register('status', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="TO-DO">To Do</option>
          <option value="IN-PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments
        </label>
        <div
          {...getRootProps()}
          className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 cursor-pointer hover:bg-gray-50"
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-300" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <input {...getInputProps()} />
              <span>Drag and drop files here, or click to select files</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, PDF up to 5MB
            </p>
          </div>
        </div>
        {attachments.length > 0 && (
          <ul className="mt-4 space-y-2">
            {attachments.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" >
          {initialData?.userId=='' ?'Create Task': 'Update Task'}
        </Button>
      </div>
    </form>
  );
}