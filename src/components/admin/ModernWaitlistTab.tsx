import * as React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { 
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  XMarkIcon,
  MapPinIcon,
  GlobeAltIcon as GlobeIcon,
  ClockIcon as TimeIcon,
  ShieldCheckIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

// Types - Using the exact Supabase database structure
import type { Database } from '../../config/database.types';

type WaitlistEntry = Database['public']['Tables']['waitlist_signups']['Row'];

// Real data will be fetched from Supabase
const initialWaitlistData: WaitlistEntry[] = [];

const ModernWaitlistTab: React.FC = () => {
  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>(initialWaitlistData);
  const [filteredData, setFilteredData] = useState<WaitlistEntry[]>(initialWaitlistData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<WaitlistEntry | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Filter and search functionality
  useEffect(() => {
    let filtered = waitlistData.filter(entry => {
      const matchesSearch = (entry.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                           (entry.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || entry.priority === priorityFilter;
      const matchesSource = sourceFilter === 'all' || entry.source === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesSource;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof WaitlistEntry];
      let bValue: any = b[sortBy as keyof WaitlistEntry];
      
      if (sortBy === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredData(filtered);
  }, [waitlistData, searchTerm, statusFilter, priorityFilter, sourceFilter, sortBy, sortOrder]);

  // Fetch real data from Supabase
  useEffect(() => {
    fetchWaitlistData();
  }, []);

  const fetchWaitlistData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('waitlist_signups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching waitlist data:', error);
        setError('Failed to fetch waitlist data. Please try again.');
        return;
      }
      
      if (data) {
        // Use the raw Supabase data directly - no transformation needed
        setWaitlistData(data);
      } else {
        setWaitlistData([]);
      }
      
    } catch (error) {
      console.error('Error fetching waitlist data:', error);
      setError('Failed to fetch waitlist data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Export functionality
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Source', 'Status', 'Priority', 'Country', 'Device', 'Created', 'Engagement Score', 'Conversion Probability'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(entry => [
        entry.name,
        entry.email,
        entry.source,
        entry.status,
        entry.priority,
        entry.country || '',
        entry.device_type || '',
        new Date(entry.created_at).toLocaleDateString(),
        entry.engagement_score || 0,
        entry.conversion_probability || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // User modal functions
  const openUserModal = (user: WaitlistEntry) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  // Status badge component
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400', icon: ClockIcon },
      contacted: { color: 'bg-blue-500/20 text-blue-400', icon: EyeIcon },
      converted: { color: 'bg-green-500/20 text-green-400', icon: CheckCircleIcon },
      declined: { color: 'bg-red-500/20 text-red-400', icon: XCircleIcon },
      qualified: { color: 'bg-purple-500/20 text-purple-400', icon: UserIcon }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  // Priority badge component
  const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
    const priorityConfig = {
      low: 'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      high: 'bg-orange-500/20 text-orange-400',
      urgent: 'bg-red-500/20 text-red-400'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[priority as keyof typeof priorityConfig]}`}>
        {priority}
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-blue-400">Loading waitlist data...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
          <div className="text-center">
            <div className="text-red-400 text-lg mb-4">⚠️ Error Loading Data</div>
            <div className="text-gray-400 mb-4">{error}</div>
            <button
              onClick={fetchWaitlistData}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-gray-800/50">
          <div className="text-2xl font-bold text-white">{filteredData.length}</div>
          <div className="text-gray-400 text-sm">Total Entries</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-gray-800/50">
          <div className="text-2xl font-bold text-yellow-400">
            {filteredData.filter(e => e.status === 'pending').length}
          </div>
          <div className="text-gray-400 text-sm">Pending</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-gray-800/50">
          <div className="text-2xl font-bold text-green-400">
            {filteredData.filter(e => e.status === 'converted').length}
          </div>
          <div className="text-gray-400 text-sm">Converted</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-gray-800/50">
          <div className="text-2xl font-bold text-blue-400">
            {filteredData.filter(e => e.status === 'contacted').length}
          </div>
          <div className="text-gray-400 text-sm">Contacted</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="declined">Declined</option>
              <option value="qualified">Qualified</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="social">Social</option>
              <option value="referral">Referral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="created_at">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
            <option value="priority">Sort by Priority</option>
            <option value="engagement_score">Sort by Engagement</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={fetchWaitlistData}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 overflow-hidden">
        <div className="p-4 border-b border-gray-800/50 bg-gray-800/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Waitlist Entries</h3>
            <div className="text-sm text-gray-400 flex items-center">
              <EyeIcon className="w-4 h-4 mr-2" />
              Click any row to view detailed information
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Engagement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredData.map((entry) => (
                <tr 
                  key={entry.id} 
                  className="hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => openUserModal(entry)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {entry.name || entry.email?.split('@')[0] || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-400">{entry.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {entry.source === 'website' && <GlobeAltIcon className="w-4 h-4 mr-2 text-blue-400" />}
                      {entry.source === 'social' && <UserIcon className="w-4 h-4 mr-2 text-purple-400" />}
                      {entry.source === 'referral' && <UserIcon className="w-4 h-4 mr-2 text-green-400" />}
                      <span className="text-sm text-gray-300 capitalize">{entry.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={entry.status || 'pending'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={entry.priority || 'low'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {entry.device_type === 'mobile' && <DevicePhoneMobileIcon className="w-4 h-4 mr-2 text-blue-400" />}
                      {entry.device_type === 'desktop' && <ComputerDesktopIcon className="w-4 h-4 mr-2 text-green-400" />}
                      <div>
                        <div className="text-sm text-white">{entry.country || 'Unknown'}</div>
                        <div className="text-xs text-gray-400 capitalize">{entry.device_type || 'Unknown'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-white">
                        Score: {entry.engagement_score || 0}
                      </div>
                      <div className="text-xs text-gray-400">
                        Conv: {((entry.conversion_probability || 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openUserModal(entry);
                        }}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing {filteredData.length} of {waitlistData.length} entries
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-colors disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white transition-colors disabled:opacity-50">
            Next
          </button>
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedUser.name || 'Anonymous User'}
                  </h2>
                  <p className="text-gray-400">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={closeUserModal}
                className="p-2 text-gray-400 hover:text-white transition-colors bg-gray-800/50 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">

              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <UserIcon className="w-5 h-5 mr-2 text-blue-400" />
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{selectedUser.name || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">{selectedUser.phone_number || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Referral Code:</span>
                        <span className="text-white">{selectedUser.referral_code || 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Consent:</span>
                        <span className={`${selectedUser.consent ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedUser.consent ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Marketing Consent:</span>
                        <span className={`${selectedUser.marketing_consent ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedUser.marketing_consent ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Campaign & Source */}
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <GlobeIcon className="w-5 h-5 mr-2 text-purple-400" />
                      Campaign & Source
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Source:</span>
                        <span className="text-white capitalize">{selectedUser.source || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">UTM Source:</span>
                        <span className="text-white">{selectedUser.utm_source || 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">UTM Medium:</span>
                        <span className="text-white">{selectedUser.utm_medium || 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">UTM Campaign:</span>
                        <span className="text-white">{selectedUser.utm_campaign || 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">UTM Term:</span>
                        <span className="text-white">{selectedUser.utm_term || 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">UTM Content:</span>
                        <span className="text-white">{selectedUser.utm_content || 'None'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Priority */}
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-400" />
                      Status & Priority
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <StatusBadge status={selectedUser.status || 'pending'} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Priority:</span>
                        <PriorityBadge priority={selectedUser.priority || 'low'} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Engagement Score:</span>
                        <span className="text-white">{selectedUser.engagement_score || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Conversion Probability:</span>
                        <span className="text-white">{((selectedUser.conversion_probability || 0) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fraud Score:</span>
                        <span className="text-white">{selectedUser.fraud_score || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Level:</span>
                        <span className={`${
                          selectedUser.risk_level === 'high' ? 'text-red-400' : 
                          selectedUser.risk_level === 'medium' ? 'text-yellow-400' : 
                          'text-green-400'
                        }`}>
                          {selectedUser.risk_level || 'low'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="space-y-6">
                  {/* Device Information */}
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <DevicePhoneMobileIcon className="w-5 h-5 mr-2 text-blue-400" />
                      Device Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Device Type:</span>
                        <span className="text-white capitalize">{selectedUser.device_type || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Device Name:</span>
                        <span className="text-white">{selectedUser.device_name || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Device Model:</span>
                        <span className="text-white">{selectedUser.device_model || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Manufacturer:</span>
                        <span className="text-white">{selectedUser.device_manufacturer || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Screen Resolution:</span>
                        <span className="text-white">{selectedUser.screen_resolution || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Viewport:</span>
                        <span className="text-white">
                          {selectedUser.viewport_width && selectedUser.viewport_height 
                            ? `${selectedUser.viewport_width} × ${selectedUser.viewport_height}` 
                            : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Browser & OS */}
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <GlobeIcon className="w-5 h-5 mr-2 text-cyan-400" />
                      Browser & Operating System
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Browser:</span>
                        <span className="text-white">{selectedUser.browser || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Browser Version:</span>
                        <span className="text-white">{selectedUser.browser_version || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Operating System:</span>
                        <span className="text-white">{selectedUser.os || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">OS Version:</span>
                        <span className="text-white">{selectedUser.os_version || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Language:</span>
                        <span className="text-white">{selectedUser.language || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Timezone:</span>
                        <span className="text-white">{selectedUser.timezone || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location & Network */}
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <MapPinIcon className="w-5 h-5 mr-2 text-green-400" />
                      Location & Network
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">IP Address:</span>
                        <span className="text-white font-mono text-sm">{selectedUser.ip_address || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Country:</span>
                        <span className="text-white">{selectedUser.country || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">City:</span>
                        <span className="text-white">{selectedUser.city || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">State:</span>
                        <span className="text-white">{selectedUser.state || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Coordinates:</span>
                        <span className="text-white">
                          {selectedUser.latitude && selectedUser.longitude 
                            ? `${selectedUser.latitude.toFixed(4)}, ${selectedUser.longitude.toFixed(4)}` 
                            : 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">ISP:</span>
                        <span className="text-white">{selectedUser.isp || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance & Engagement */}
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <TimeIcon className="w-5 h-5 mr-2 text-yellow-400" />
                      Performance & Engagement
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Page Load Time:</span>
                        <span className="text-white">{selectedUser.page_load_time ? `${selectedUser.page_load_time}ms` : 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time on Page:</span>
                        <span className="text-white">{selectedUser.time_on_page ? `${selectedUser.time_on_page}s` : 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Scroll Depth:</span>
                        <span className="text-white">{selectedUser.scroll_depth ? `${selectedUser.scroll_depth}%` : 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Landing Page:</span>
                        <span className="text-white text-sm truncate max-w-[200px]">{selectedUser.landing_page || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Referrer:</span>
                        <span className="text-white text-sm truncate max-w-[200px]">{selectedUser.referrer || 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Session ID:</span>
                        <span className="text-white font-mono text-sm">{selectedUser.session_id || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Technical Details */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Hardware & Capabilities */}
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <CpuChipIcon className="w-5 h-5 mr-2 text-purple-400" />
                    Hardware & Capabilities
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">CPU Cores:</span>
                      <span className="text-white">{selectedUser.cpu_cores || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Memory:</span>
                      <span className="text-white">{selectedUser.memory_gb ? `${selectedUser.memory_gb}GB` : 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Color Depth:</span>
                      <span className="text-white">{selectedUser.color_depth ? `${selectedUser.color_depth}bit` : 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pixel Ratio:</span>
                      <span className="text-white">{selectedUser.pixel_ratio || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Touch Support:</span>
                      <span className={`${selectedUser.touch_support ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedUser.touch_support ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">WebGL Support:</span>
                      <span className={`${selectedUser.webgl_support ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedUser.webgl_support ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security & Privacy */}
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 mr-2 text-red-400" />
                    Security & Privacy
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cookies Enabled:</span>
                      <span className={`${selectedUser.cookie_enabled ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedUser.cookie_enabled ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Do Not Track:</span>
                      <span className={`${selectedUser.do_not_track ? 'text-yellow-400' : 'text-green-400'}`}>
                        {selectedUser.do_not_track ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ad Blocker:</span>
                      <span className={`${selectedUser.ad_blocker_detected ? 'text-yellow-400' : 'text-green-400'}`}>
                        {selectedUser.ad_blocker_detected ? 'Detected' : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Proxy Detected:</span>
                      <span className={`${selectedUser.proxy_detected ? 'text-yellow-400' : 'text-green-400'}`}>
                        {selectedUser.proxy_detected ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">VPN Detected:</span>
                      <span className={`${selectedUser.vpn_detected ? 'text-yellow-400' : 'text-green-400'}`}>
                        {selectedUser.vpn_detected ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tor Detected:</span>
                      <span className={`${selectedUser.tor_detected ? 'text-red-400' : 'text-green-400'}`}>
                        {selectedUser.tor_detected ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-blue-400" />
                    Timestamps
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created:</span>
                      <span className="text-white">{new Date(selectedUser.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Updated:</span>
                      <span className="text-white">
                        {selectedUser.updated_at ? new Date(selectedUser.updated_at).toLocaleString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">User Agent:</span>
                      <span className="text-white text-xs truncate max-w-[200px]" title={selectedUser.user_agent || ''}>
                        {selectedUser.user_agent || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-800/50 bg-gray-800/20">
              <button
                onClick={closeUserModal}
                className="px-6 py-2 bg-gray-700/50 text-gray-300 hover:text-white border border-gray-600/50 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernWaitlistTab;
