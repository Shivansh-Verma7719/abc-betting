'use client';

import React, { useState } from 'react';
import {
    Button,
    Input,
    Card,
    CardBody,
    Checkbox,
    Divider,
    Spinner,
    Alert
} from '@heroui/react';
import { SPORTS_DATA } from '../app/data';
import { createClient } from '../utils/supabase/client';
import { compressImage } from '../utils/images/compression';
import { uploadImage } from '../utils/images/upload';
import Image from 'next/image';

interface FormData {
    name: string;
    email: string;
    selectedSports: string[];
    selectedTeams: string[];
    paymentConfirmationImage?: File;
}

export default function BettingForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        selectedSports: [],
        selectedTeams: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressionError, setCompressionError] = useState<string | null>(null);
    const [imageUploadUrl, setImageUploadUrl] = useState<string | null>(null);

    const handleSportToggle = (sportId: string) => {
        setFormData(prev => {
            const isSelected = prev.selectedSports.includes(sportId);
            const newSelectedSports = isSelected
                ? prev.selectedSports.filter(id => id !== sportId)
                : [...prev.selectedSports, sportId];

            // Remove teams that belong to deselected sports
            if (isSelected) {
                const sportData = SPORTS_DATA.find(sport => sport.id === sportId);
                const newSelectedTeams = prev.selectedTeams.filter(team =>
                    !sportData?.teams.includes(team)
                );
                return {
                    ...prev,
                    selectedSports: newSelectedSports,
                    selectedTeams: newSelectedTeams
                };
            }

            return {
                ...prev,
                selectedSports: newSelectedSports
            };
        });
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setCompressionError('Please upload a valid image file');
            return;
        }

        setIsCompressing(true);
        setCompressionError(null);
        setImagePreview(null);

        try {
            // Compress the image
            const compressionResult = await compressImage(file, {
                maxSizeMB: 2,
                maxWidthOrHeight: 1200,
                quality: 0.8,
                fileType: 'image/webp'
            });

            // Check if compressed file is still too large
            if (compressionResult.file.size > 2 * 1024 * 1024) {
                setCompressionError('Image is too large. Please upload a smaller image (max 2MB after compression)');
                setIsCompressing(false);
                return;
            }

            // Create preview URL
            const previewUrl = URL.createObjectURL(compressionResult.file);
            setImagePreview(previewUrl);

            // Update form data
            setFormData(prev => ({
                ...prev,
                paymentConfirmationImage: compressionResult.file
            }));

            console.log('Image compression successful:', compressionResult.compressionInfo);
        } catch (error) {
            console.error('Image compression failed:', error);
            setCompressionError('Failed to process image. Please try again.');
        } finally {
            setIsCompressing(false);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setFormData(prev => ({
            ...prev,
            paymentConfirmationImage: undefined
        }));
        setCompressionError(null);
        // Reset file input
        const fileInput = document.getElementById('payment-image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleTeamToggle = (team: string) => {
        setFormData(prev => ({
            ...prev,
            selectedTeams: prev.selectedTeams.includes(team)
                ? prev.selectedTeams.filter(t => t !== team)
                : prev.selectedTeams.length < 7
                    ? [...prev.selectedTeams, team]
                    : prev.selectedTeams
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || formData.selectedSports.length === 0 || formData.selectedTeams.length === 0) {
            setSubmitMessage('Please fill in all fields, select at least one sport and one team.');
            return;
        }

        if (!formData.paymentConfirmationImage) {
            setSubmitMessage('Please upload a payment confirmation screenshot.');
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            // First upload the image
            const uploadResult = await uploadImage(formData.paymentConfirmationImage, {
                bucket: 'betting-images',
                folder: 'payment-confirmations',
                generateUniqueFileName: true,
                compression: {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1000,
                    quality: 0.8
                }
            });

            if (!uploadResult.success) {
                throw new Error(uploadResult.error || 'Failed to upload image');
            }

            setImageUploadUrl(uploadResult.url || null);

            // Then submit the form data with image URL
            const supabase = createClient();
            const { error } = await supabase
                .from('betting_submissions')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        sports: formData.selectedSports,
                        teams: formData.selectedTeams,
                        payment_confirmation_url: uploadResult.url
                    }
                ]);

            if (error) {
                throw error;
            }

            setSubmitMessage('Submission successful! Thank you for participating.');
            setFormData({
                name: '',
                email: '',
                selectedSports: [],
                selectedTeams: []
            });
            setImagePreview(null);
            setImageUploadUrl(null);

            // Reset file input
            const fileInput = document.getElementById('payment-image') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitMessage(`Error submitting form: ${error instanceof Error ? error.message : 'Please try again.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardBody className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                        <Input
                            label="Name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                            variant="bordered"
                        />
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required
                            variant="bordered"
                        />
                    </div>

                    <Divider />

                    {/* Sport Selection */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Sport Selection</h3>
                            <span className="text-sm text-gray-500">
                                {formData.selectedSports.length}/7 selected
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Select the sports you want to bet on (up to 7)
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {SPORTS_DATA.map((sport) => (
                                <Checkbox
                                    key={sport.id}
                                    isSelected={formData.selectedSports.includes(sport.id)}
                                    onChange={() => handleSportToggle(sport.id)}
                                    isDisabled={
                                        !formData.selectedSports.includes(sport.id) &&
                                        formData.selectedSports.length >= 7
                                    }
                                    className="w-full"
                                >
                                    <span className="text-sm font-medium">{sport.name}</span>
                                </Checkbox>
                            ))}
                        </div>
                    </div>

                    {/* Team Selection */}
                    {formData.selectedSports.length > 0 && (
                        <>
                            <Divider />
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800">Team Selection</h3>
                                    <span className="text-sm text-gray-500">
                                        {formData.selectedTeams.length}/7 selected
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Select up to 7 teams from your chosen sports
                                </p>

                                {formData.selectedSports.map((sportId) => {
                                    const sport = SPORTS_DATA.find(s => s.id === sportId);
                                    if (!sport) return null;

                                    return (
                                        <div key={sportId} className="border rounded-lg p-4 bg-gray-50">
                                            <h4 className="font-medium text-gray-800 mb-3">{sport.name}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {sport.teams.map((team) => (
                                                    <Checkbox
                                                        key={team}
                                                        isSelected={formData.selectedTeams.includes(team)}
                                                        onChange={() => handleTeamToggle(team)}
                                                        isDisabled={
                                                            !formData.selectedTeams.includes(team) &&
                                                            formData.selectedTeams.length >= 7
                                                        }
                                                        className="w-full"
                                                    >
                                                        <span className="text-sm">{team}</span>
                                                    </Checkbox>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Payment Confirmation Image Upload */}
                    <Divider />
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Payment Confirmation</h3>
                        <p className="text-sm text-gray-600">
                            Upload a screenshot of your payment confirmation (max 2MB)
                        </p>

                        <div className="space-y-4">
                            <input
                                id="payment-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                disabled={isCompressing}
                            />

                            {isCompressing && (
                                <div className="flex items-center gap-2 text-blue-600">
                                    <Spinner size="sm" />
                                    <span className="text-sm">Compressing image...</span>
                                </div>
                            )}

                            {compressionError && (
                                <Alert
                                    color="danger"
                                    title="Upload Error"
                                    className="mt-2"
                                >
                                    {compressionError}
                                </Alert>
                            )}

                            {imagePreview && !isCompressing && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-green-600">Image ready for upload</span>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            variant="flat"
                                            onClick={removeImage}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                    <div className="relative w-48 h-32 border rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={imagePreview}
                                            alt="Payment confirmation preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Divider />
                    <div className="space-y-4">
                        <Button
                            type="submit"
                            color="primary"
                            size="lg"
                            className="w-full"
                            isDisabled={
                                !formData.name ||
                                !formData.email ||
                                formData.selectedSports.length === 0 ||
                                formData.selectedTeams.length === 0 ||
                                !formData.paymentConfirmationImage ||
                                isSubmitting ||
                                isCompressing
                            }
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner size="sm" color="white" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Betting Form'
                            )}
                        </Button>

                        {submitMessage && (
                            <Alert
                                color={submitMessage.includes('successful') ? 'success' : 'danger'}
                                title={submitMessage.includes('successful') ? 'Success!' : 'Error'}
                                className="mt-4"
                            >
                                {submitMessage}
                            </Alert>
                        )}
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}