
export const handleSchoolSubmission = async (formData, imageFile) => {
  try {
    let imageUrl = '';
    
    // Upload image to Cloudinary if provided
    if (imageFile) {
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);
      
      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: imageFormData,
      });
      
      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Image upload failed');
      }
      
      const uploadResult = await uploadResponse.json();
      imageUrl = uploadResult.url;
    }
    
    // Submit school data with image URL
    const schoolData = {
      ...formData,
      image: imageUrl
    };
    
    const response = await fetch('/api/schools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schoolData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add school');
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Form submission error:', error);
    throw error;
  }
};

// Usage in your form component:
/*
import { handleSchoolSubmission } from '../utils/formHandler';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setLoading(true);
    
    const formData = {
      name: schoolName,
      address: address,
      city: city,
      state: state,
      contact: contact,
      email_id: email,
      board: board,
      type: type,
      hostel_facility: hostelFacility
    };
    
    const result = await handleSchoolSubmission(formData, imageFile);
    
    alert('School added successfully!');
    // Reset form or redirect
    
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
*/