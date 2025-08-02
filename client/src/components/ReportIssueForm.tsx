// src/components/ReportIssueForm.tsx
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { supabase } from '../database/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

type Inputs = {
  title: string;
  description: string;
  issueImage: FileList;
};

// Define a prop to close the modal from the parent
type ReportIssueFormProps = {
  onClose: () => void;
};

export const ReportIssueForm = ({ onClose }: ReportIssueFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!user) {
      setError("You must be logged in to report an issue.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // 1. Get User's GPS Location
      const location = await new Promise<{ lat: number; lon: number }>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
          (err) => reject(err)
        );
      });

      // 2. Upload the Image to Supabase Storage
      const imageFile = data.issueImage[0];
      const filePath = `${user.id}/${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage.from('issue-images').upload(filePath, imageFile);
      if (uploadError) throw uploadError;

      // 3. Get the Public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage.from('issue-images').getPublicUrl(filePath);

      // 4. Insert the new issue into the database
      const { error: insertError } = await supabase.from('issues').insert({
        title: data.title,
        description: data.description,
        image_url: publicUrl,
        latitude: location.lat,
        longitude: location.lon,
        reporter_id: user.id,
      });
      if (insertError) throw insertError;
      
      alert("Issue reported successfully!");
      onClose(); // Close the modal on success
      
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred while submitting the report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Report New Issue</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input id="title" type="text" {...register("title", { required: "Title is required" })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" {...register("description")} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div>
          <label htmlFor="issueImage" className="block text-sm font-medium text-gray-700">Image</label>
          <input id="issueImage" type="file" accept="image/*" {...register("issueImage", { required: "An image is required" })} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
          {errors.issueImage && <p className="mt-1 text-sm text-red-600">{errors.issueImage.message}</p>}
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Report'}
            </button>
        </div>
      </form>
    </div>
  );
};