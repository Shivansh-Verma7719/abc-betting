'use client';

import React, { useState } from 'react';
import {
    Button,
    Input,
    Card,
    CardBody,
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
            if (compressionResult.file.size > 2.5 * 1024 * 1024) {
                setCompressionError('Image is too large. Please upload a smaller image in size');
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

    const handleTeamToggle = (team: string, sportId: string) => {
        setFormData(prev => {
            const currentSportTeams = SPORTS_DATA.find(s => s.id === sportId)?.teams || [];
            const isCurrentTeamSelected = prev.selectedTeams.includes(team);

            if (isCurrentTeamSelected) {
                // Remove the team if it's already selected
                return {
                    ...prev,
                    selectedTeams: prev.selectedTeams.filter(t => t !== team)
                };
            } else {
                // Remove any other team from this sport and add the new one
                const teamsFromOtherSports = prev.selectedTeams.filter(t => !currentSportTeams.includes(t));
                return {
                    ...prev,
                    selectedTeams: [...teamsFromOtherSports, team]
                };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || formData.selectedSports.length === 0 || formData.selectedTeams.length === 0) {
            setSubmitMessage('Please fill in all fields, select at least one sport and one team.');
            return;
        }

        // Check if user has selected 1 team for each sport
        if (formData.selectedTeams.length !== formData.selectedSports.length) {
            setSubmitMessage('Please select exactly 1 team for each sport you chose.');
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
                bucket: 'payment-confirmations',
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
        <Card className="w-full max-w-4xl mx-auto shadow-xl">
            <CardBody className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">👤</span>
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <Divider />

                    {/* Sport Selection */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">🏆</span>
                                Sport Selection
                            </h3>
                            <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                                {formData.selectedSports.length}/7 selected
                            </span>
                        </div>
                        <p className="text-gray-600">
                            Select the sports you want to bet on (up to 7)
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {SPORTS_DATA.map((sport) => {
                                const isSelected = formData.selectedSports.includes(sport.id);
                                const isDisabled = !isSelected && formData.selectedSports.length >= 7;

                                return (
                                    <div
                                        key={sport.id}
                                        onClick={() => !isDisabled && handleSportToggle(sport.id)}
                                        className={`
                                            relative cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105
                                            rounded-lg p-4 border-2 min-h-[90px] flex items-center justify-center
                                            ${isSelected
                                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                                                : isDisabled
                                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                                                    : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-sm'
                                            }
                                            ${isSelected ? 'ring-1 ring-blue-200 ring-opacity-50' : ''}
                                        `}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="text-center">
                                            <div className="text-2xl mb-1">
                                                {sport.id === 'football' && '🏈'}
                                                {sport.id === 'basketball' && '🏀'}
                                                {sport.id === 'cricket' && '🏏'}
                                                {sport.id === 'tennis' && '🎾'}
                                                {sport.id === 'baseball' && '⚾'}
                                                {sport.id === 'hockey' && '🏒'}
                                                {sport.id === 'soccer' && '⚽'}
                                            </div>
                                            <h4 className={`font-semibold text-xs ${isSelected ? 'text-blue-700' : isDisabled ? 'text-gray-400' : 'text-gray-700'
                                                }`}>
                                                {sport.name}
                                            </h4>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Team Selection */}
                    {formData.selectedSports.length > 0 && (
                        <>
                            <Divider />
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <span className="text-2xl">🏅</span>
                                        Team Selection
                                    </h3>
                                    <span className="text-sm font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
                                        {formData.selectedTeams.length}/{formData.selectedSports.length} selected
                                    </span>
                                </div>
                                <p className="text-gray-600">
                                    Select 1 team from each sport you chose
                                </p>

                                <div className="space-y-6">
                                    {formData.selectedSports.map((sportId) => {
                                        const sport = SPORTS_DATA.find(s => s.id === sportId);
                                        if (!sport) return null;

                                        return (
                                            <div key={sportId} className="border-2 border-indigo-200 rounded-xl p-6 bg-gradient-to-br from-indigo-25 to-indigo-50">
                                                <h4 className="font-bold text-indigo-800 mb-4 text-lg flex items-center gap-3">
                                                    <span className="text-2xl">
                                                        {sportId === 'football' && '🏈'}
                                                        {sportId === 'basketball' && '🏀'}
                                                        {sportId === 'cricket' && '🏏'}
                                                        {sportId === 'tennis' && '🎾'}
                                                        {sportId === 'baseball' && '⚾'}
                                                        {sportId === 'hockey' && '🏒'}
                                                        {sportId === 'soccer' && '⚽'}
                                                    </span>
                                                    {sport.name}
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {sport.teams.map((team) => {
                                                        const isSelected = formData.selectedTeams.includes(team);

                                                        return (
                                                            <div
                                                                key={team}
                                                                onClick={() => handleTeamToggle(team, sportId)}
                                                                className={`
                                                                    relative cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-102
                                                                    rounded-lg p-4 border text-sm font-medium text-center min-h-[60px] flex items-center justify-center
                                                                    ${isSelected
                                                                        ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-md'
                                                                        : 'border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:bg-green-25 hover:shadow-sm'
                                                                    }
                                                                    ${isSelected ? 'ring-1 ring-green-200' : ''}
                                                                `}
                                                            >
                                                                {isSelected && (
                                                                    <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                                <span className="pr-2">{team}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Payment Confirmation Image Upload */}
                    <Divider />
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">💳</span>
                            Payment Confirmation
                        </h3>
                        <p className="text-gray-600">
                            Upload a screenshot of your payment confirmation
                        </p>

                        <div className="space-y-4">
                            <input
                                id="payment-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                                disabled={isCompressing}
                            />

                            {isCompressing && (
                                <div className="flex items-center gap-3 text-blue-600 bg-blue-50 p-4 rounded-lg">
                                    <Spinner size="sm" />
                                    <span className="text-sm font-medium">Processing image...</span>
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
                                    <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                                        <span className="text-sm font-medium text-green-600 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Image ready
                                        </span>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            variant="flat"
                                            onClick={removeImage}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                    <div className="relative w-64 h-40 border-2 border-green-200 rounded-lg overflow-hidden bg-gray-100 mx-auto">
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
                            className="w-full h-14 text-lg font-semibold"
                            isDisabled={
                                !formData.name ||
                                !formData.email ||
                                formData.selectedSports.length === 0 ||
                                formData.selectedTeams.length !== formData.selectedSports.length ||
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
                                <>
                                    <span className="mr-2">🚀</span>
                                    Submit Betting Form
                                </>
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