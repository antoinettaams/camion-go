export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset'); // À remplacer par votre preset
  formData.append('cloud_name', 'your_cloud_name'); // À remplacer

  const response = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}