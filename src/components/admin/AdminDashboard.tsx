import * as React from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

import TestAdminPanel from './TestAdminPanel';
import ModernAdminDashboard from './ModernAdminDashboard';
import Modal from './shared/Modal';
import ProjectForm from './forms/ProjectForm';
import { adminDataService, Project, MerchandiseItem, Perk } from '../../services/adminDataService';

export type AdminPanel = 'projects' | 'merchandise' | 'perks' | 'media' | 'users' | 'settings' | 'activity' | 'test' | 'modern';

const AdminDashboard: React.FC = () => {
  
    const [activePanel, setActivePanel] = React.useState<AdminPanel>('modern');
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    const { isAuthenticated, isLoading, login } = useAdminAuth();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginError, setLoginError] = React.useState('');

    // Data states
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [merchandise, setMerchandise] = React.useState<MerchandiseItem[]>([]);
    const [perks, setPerks] = React.useState<Perk[]>([]);

    const [loading, setLoading] = React.useState(false);

    // Modal states
    const [showProjectModal, setShowProjectModal] = React.useState(false);
    const [editingProject, setEditingProject] = React.useState<Project | null>(null);

    // Force re-render when authentication state changes
    React.useEffect(() => {
      // Authentication state changed
    }, [isAuthenticated]);

    // Keyboard shortcut for sidebar toggle (Ctrl/Cmd + B)
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
          event.preventDefault();
          setSidebarCollapsed(prev => !prev);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Load data when authenticated
    React.useEffect(() => {
      if (isAuthenticated) {
        loadData();
      }
    }, [isAuthenticated]);

    const loadData = async () => {
      setLoading(true);
      try {
        const [projectsData, merchandiseData, perksData] = await Promise.all([
          adminDataService.getProjects(),
          adminDataService.getMerchandise(),
          adminDataService.getPerks()
        ]);
        
        setProjects(projectsData);
        setMerchandise(merchandiseData);
        setPerks(perksData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError('');
      
      if (!username || !password) {
        setLoginError('Please enter both username and password');
        return;
      }

      const success = await login(username, password);
      if (!success) {
        setLoginError('Invalid username or password');
      }
    };

    const handleProjectSubmit = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
      setLoading(true);
      try {
        if (editingProject) {
          const updatedProject = await adminDataService.updateProject(editingProject.id, projectData);
          if (updatedProject) {
            setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
          }
        } else {
          const newProject = await adminDataService.createProject(projectData);
          setProjects(prev => [...prev, newProject]);
        }
        setShowProjectModal(false);
        setEditingProject(null);
      } catch (error) {
        console.error('Error saving project:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleDeleteProject = async (projectId: string) => {
      if (window.confirm('Are you sure you want to delete this project?')) {
        setLoading(true);
        try {
          const success = await adminDataService.deleteProject(projectId);
          if (success) {
            setProjects(prev => prev.filter(p => p.id !== projectId));
          }
        } catch (error) {
          console.error('Error deleting project:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    const openProjectModal = (project?: Project) => {
      setEditingProject(project || null);
      setShowProjectModal(true);
    };
    
    // If not authenticated, show login screen
    if (!isAuthenticated && !isLoading) {

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="w-full max-w-md p-8 bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Admin Portal</h1>
              <p className="text-gray-400">Enter your credentials to access the admin panel</p>
            </div>

            {loginError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">{loginError}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl"
                  placeholder="Enter password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => window.location.href = '/'}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Loading state
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      );
    }

    const renderPanel = () => {
      try {
        switch (activePanel) {
          case 'projects':
            return (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Projects Management</h2>
                  <button 
                    onClick={() => openProjectModal()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
                  >
                    + Add Project
                  </button>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <div key={project.id} className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.status === 'active' ? 'bg-green-500/20 text-green-300' :
                            project.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                            project.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{project.category} • {project.type}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">{project.fundedPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" 
                              style={{width: `${project.fundedPercentage}%`}}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Target</span>
                            <span className="text-white">₹{project.targetAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Raised</span>
                            <span className="text-white">₹{project.raisedAmount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openProjectModal(project)}
                            className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg hover:bg-gray-800/70 transition-all text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="px-3 py-2 bg-red-600/50 border border-red-500/50 text-red-200 rounded-lg hover:bg-red-600/70 transition-all text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          case 'merchandise':
            return (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Merchandise Management</h2>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all">
                    + Add Item
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {merchandise.map((item) => (
                    <div key={item.id} className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{item.category} • {item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">₹{item.price.toLocaleString()}</span>
                        <span className={`text-sm ${
                          item.status === 'in_stock' ? 'text-green-300' :
                          item.status === 'low_stock' ? 'text-yellow-300' :
                          'text-red-300'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-400">
                        Stock: {item.stock} units
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          case 'perks':
            return (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Perks & Rewards</h2>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all">
                    + Add Perk
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {perks.map((perk) => (
                    <div key={perk.id} className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
                      <h3 className="text-lg font-semibold text-white mb-2">{perk.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{perk.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">₹{perk.price.toLocaleString()}</span>
                        <span className={`text-sm ${
                          perk.status === 'available' ? 'text-green-300' :
                          perk.status === 'limited' ? 'text-yellow-300' :
                          'text-red-300'
                        }`}>
                          {perk.status.replace('_', ' ')}
                        </span>
                      </div>
                      {perk.maxQuantity && (
                        <div className="mt-2 text-sm text-gray-400">
                          Available: {perk.currentQuantity || 0}/{perk.maxQuantity}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'test':
            return (
              <div className="p-6">
                <TestAdminPanel />
              </div>
            );
          case 'modern':
                          return (
                <div className="h-full">
                  <ModernAdminDashboard />
                </div>
              );
          default:
            return (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Projects Panel</h2>
                <p className="text-gray-400">Project management functionality will be available soon.</p>
              </div>
            );
        }
      } catch (error) {
        console.error('Error rendering admin panel:', error);
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-400 mb-4">Error loading panel content</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600"
              >
                Reload Page
              </button>
            </div>
          </div>
        );
      }
    };

    const navItems = [
      { id: 'modern', label: 'Overview', icon: '🚀' },
      { id: 'projects', label: 'Projects', icon: '🎬' },
      { id: 'merchandise', label: 'Merchandise', icon: '🛍️' },
      { id: 'perks', label: 'Perks & Rewards', icon: '🎁' },
      { id: 'media', label: 'Media Assets', icon: '📁' },
      { id: 'users', label: 'Users', icon: '👥' },

      { id: 'activity', label: 'Activity Log', icon: '📝' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'test', label: 'Test Panel', icon: '🧪' },
    ];

    return (
      <div className="min-h-screen bg-black">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <div className={`transition-all duration-300 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800/50 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}>
            {/* Header */}
            <div className={`border-b border-gray-800/50 transition-all duration-300 ${
              sidebarCollapsed ? 'p-4' : 'p-6'
            }`}>
              <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <h1 className="font-bold text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Circles Admin</h1>
                    <p className="text-xs text-gray-400">Management Dashboard</p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className={`transition-all duration-300 ${
              sidebarCollapsed ? 'p-2' : 'p-4'
            }`}>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePanel(item.id as AdminPanel)}
                    className={`w-full flex items-center transition-all duration-200 rounded-xl ${
                      sidebarCollapsed 
                        ? 'justify-center px-2 py-3' 
                        : 'space-x-3 px-4 py-3'
                    } ${
                      activePanel === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                ))}
              </nav>
            </div>

            {/* User Info */}
            <div className={`mt-auto border-t border-gray-800/50 transition-all duration-300 ${
              sidebarCollapsed ? 'p-2' : 'p-4'
            }`}>
              <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <p className="text-white font-medium">Admin User</p>
                    <p className="text-gray-400 text-sm">Administrator</p>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="mt-3">
                  <button
                    onClick={() => (window.location.href = '/')}
                    className="w-full px-4 py-2 rounded-lg border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors text-sm"
                  >
                    ← Back to Home
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="sticky top-0 z-20 px-6 py-4 md:py-5 border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl shadow-sm">
              <div className="flex items-center justify-between gap-2 md:gap-4">
                <div className="flex items-center gap-4">
                  {/* Sidebar Toggle */}
                  <button 
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 text-gray-400 hover:text-white transition-colors bg-gray-800/50 rounded-lg"
                    title={`${sidebarCollapsed ? "Expand" : "Collapse"} Sidebar (Ctrl+B)`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className={`w-3 h-0.5 bg-current transition-all duration-300 ${
                        sidebarCollapsed ? 'rotate-45 translate-y-0.5' : '-rotate-45 -translate-y-0.5'
                      }`}></div>
                      <div className={`w-3 h-0.5 bg-current transition-all duration-300 ${
                        sidebarCollapsed ? '-rotate-45 -translate-y-0.5' : 'rotate-45 translate-y-0.5'
                      }`}></div>
                    </div>
                  </button>
                  
                  <div className="min-w-0">
                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight truncate">
                      {navItems.find(item => item.id === activePanel)?.label || 'Admin Dashboard'}
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">Manage your platform and content</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 md:gap-3 shrink-0">
                  <button
                    onClick={() => (window.location.href = '/')}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors text-sm"
                  >
                    <span>← Back to Home</span>
                  </button>
                </div>
              </div>
            </header>
            
            {/* Content Area */}
            <main className="flex-1 overflow-y-auto">
              {renderPanel()}
            </main>
          </div>
        </div>

        {/* Project Modal */}
        <Modal
          isOpen={showProjectModal}
          onClose={() => {
            setShowProjectModal(false);
            setEditingProject(null);
          }}
          title={editingProject ? 'Edit Project' : 'Add New Project'}
          size="xl"
        >
          <ProjectForm
            project={editingProject || undefined}
            onSubmit={handleProjectSubmit}
            onCancel={() => {
              setShowProjectModal(false);
              setEditingProject(null);
            }}
            loading={loading}
          />
        </Modal>
      </div>
    );
  };

export default AdminDashboard;