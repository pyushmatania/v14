import React, { useState } from 'react';
import { Project } from '../../../services/adminDataService';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    type: project?.type || 'film',
    category: project?.category || '',
    language: project?.language || '',
    status: project?.status || 'active',
    fundedPercentage: project?.fundedPercentage || 0,
    targetAmount: project?.targetAmount || 0,
    raisedAmount: project?.raisedAmount || 0,
    poster: project?.poster || '',
    tags: project?.tags || [],
    description: project?.description || '',
    genre: project?.genre || '',
    perks: project?.perks || [],
    director: project?.director || '',
    cast: project?.cast || [],
    releaseDate: project?.releaseDate || '',
    duration: project?.duration || ''
  });

  const [newTag, setNewTag] = useState('');
  const [newPerk, setNewPerk] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addPerk = () => {
    if (newPerk.trim() && !formData.perks.includes(newPerk.trim())) {
      setFormData(prev => ({
        ...prev,
        perks: [...prev.perks, newPerk.trim()]
      }));
      setNewPerk('');
    }
  };

  const removePerk = (perkToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      perks: prev.perks.filter(perk => perk !== perkToRemove)
    }));
  };

  const addCastMember = () => {
    const castInput = document.getElementById('cast') as HTMLInputElement;
    if (castInput && castInput.value.trim() && !formData.cast.includes(castInput.value.trim())) {
      setFormData(prev => ({
        ...prev,
        cast: [...prev.cast, castInput.value.trim()]
      }));
      castInput.value = '';
    }
  };

  const removeCastMember = (memberToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      cast: prev.cast.filter(member => member !== memberToRemove)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter project title"
            required
                />
              </div>

              <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Project Type *
                </label>
                <select
                  value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Project['type'] }))}
            className="w-full px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            required
                >
                  <option value="film">Film</option>
                  <option value="music">Music</option>
                  <option value="webseries">Web Series</option>
            <option value="documentary">Documentary</option>
                </select>
              </div>

              <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Category *
                </label>
                <input
                  type="text"
                  value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Bollywood, Hollywood"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Language *
          </label>
          <input
            type="text"
            value={formData.language}
            onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
            className="w-full px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Hindi, English"
            required
          />
              </div>

              <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Status *
                </label>
                <select
                  value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
            className="w-full px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            required
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Genre *
          </label>
          <input
            type="text"
            value={formData.genre}
            onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
            className="w-full px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Action, Drama, Comedy"
            required
          />
        </div>
      </div>

      {/* Financial Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Target Amount (₹) *
                </label>
                <input
                  type="number"
                  value={formData.targetAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: Number(e.target.value) }))}
            className="w-full px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="0"
            required
          />
              </div>

              <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Raised Amount (₹) *
                </label>
                <input
                  type="number"
                  value={formData.raisedAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, raisedAmount: Number(e.target.value) }))}
            className="w-full px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="0"
            required
                />
              </div>

              <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Funded Percentage (%)
                </label>
                  <input
                    type="number"
                    value={formData.fundedPercentage}
            onChange={(e) => setFormData(prev => ({ ...prev, fundedPercentage: Number(e.target.value) }))}
            className="w-full px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="0"
                    min="0"
                    max="100"
                  />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-red-200 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter project description..."
          required
        />
      </div>

      {/* Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Poster URL
          </label>
          <input
            type="url"
            value={formData.poster}
            onChange={(e) => setFormData(prev => ({ ...prev, poster: e.target.value }))}
            className="w-full px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="https://example.com/poster.jpg"
          />
                </div>

        <div>
          <label className="block text-sm font-medium text-red-200 mb-2">
            Duration
          </label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            className="w-full px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., 2h 35m, 8 Episodes"
                    />
                  </div>
                </div>

      {/* Release Date */}
      <div>
        <label className="block text-sm font-medium text-red-200 mb-2">
          Release Date
        </label>
        <input
          type="date"
          value={formData.releaseDate}
          onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
          className="w-full px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
              </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-red-200 mb-2">
          Tags
                </label>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Add a tag..."
                          />
                          <button
                            type="button"
            onClick={addTag}
            className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
          >
            Add
                          </button>
                        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-red-600/30 text-red-200 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-red-300 hover:text-white"
              >
                ×
              </button>
                          </span>
          ))}
                    </div>
                  </div>
                  
      {/* Cast */}
                  <div>
        <label className="block text-sm font-medium text-red-200 mb-2">
          Cast Members
        </label>
        <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
            id="cast"
            className="flex-1 px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Add cast member..."
          />
          <button
            type="button"
            onClick={addCastMember}
            className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
          >
            Add
          </button>
                  </div>
        <div className="flex flex-wrap gap-2">
          {formData.cast.map((member, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-red-600/30 text-red-200 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{member}</span>
              <button
                type="button"
                onClick={() => removeCastMember(member)}
                className="text-red-300 hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Perks */}
      <div>
        <label className="block text-sm font-medium text-red-200 mb-2">
          Perks & Rewards
        </label>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={newPerk}
            onChange={(e) => setNewPerk(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPerk())}
            className="flex-1 px-4 py-3 bg-red-700/50 border border-red-600/50 rounded-lg text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Add a perk..."
          />
          <button
            type="button"
            onClick={addPerk}
            className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.perks.map((perk, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-red-600/30 text-red-200 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{perk}</span>
              <button
                type="button"
                onClick={() => removePerk(perk)}
                className="text-red-300 hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
            </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-red-700/30">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-red-700/50 border border-red-600/50 text-white rounded-lg hover:bg-red-700/70 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
        </button>
    </div>
    </form>
  );
};

export default ProjectForm;