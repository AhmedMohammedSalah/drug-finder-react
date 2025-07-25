import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PharmacistRequestCard from '../../components/admin/PharmacistRequestCard';
import PharmacistFilter from '../../components/admin/PharmacistFilter';
import SummaryStatisticsCard from '../../components/admin/SummaryStatisticsCard';
import AdminLoader from '../../components/admin/adminLoader';
import Pagination from '../../components/shared/pagination';
import PharmacistModal from '../../components/admin/PharmacistModal';
import { Inbox } from 'lucide-react';

const PharmacistRequestsPage = () => {
  const [selectedPharmacist, setSelectedPharmacist] = useState(null);
  const [pharmacists, setPharmacists] = useState([]);
  const [filteredPharmacists, setFilteredPharmacists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
  });

  useEffect(() => {
    const fetchPharmacists = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://localhost:8000/users/all-pharmacists/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data; // New endpoint returns array directly, not paginated

        // see the data that comming from backend
        console.log('Fetched pharmacists:', data);

        setPharmacists(data);
        setFilteredPharmacists(data);
        updateStatistics(data);
        setPagination(prev => ({
          ...prev,
          totalItems: data.length,
        }));
      } catch (err) {
        setError('Failed to fetch pharmacists. Please try again.');
        console.error('Failed to fetch pharmacists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacists();
  }, []);

  const updateStatistics = (data) => {
    const pending = data.filter(p => p.license_status === 'pending').length;
    const approved = data.filter(p => p.license_status === 'approved').length;
    const rejected = data.filter(p => p.license_status === 'rejected').length;

    setStats({
      pending,
      approved,
      rejected,
      total: data.length,
    });
    // Log stats to verify pending count
    console.log('Stats:', { pending, approved, rejected, total: data.length });
  };

  const handleFilterChange = (filters) => {
    let filtered = [...pharmacists];

    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.license_status === filters.status);
    }

    filtered.sort((a, b) => {
      if (filters.sort === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (filters.sort === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (filters.sort === 'name_asc') return a.name.localeCompare(b.name);
      if (filters.sort === 'name_desc') return b.name.localeCompare(a.name);
      return 0;
    });

    setFilteredPharmacists(filtered);
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalItems: filtered.length,
    }));
    // Log filtered pharmacists
    console.log('Filtered pharmacists:', filtered);
  };

  const handleUpdatePharmacist = async (id, newStatus, rejectMessage = '') => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/users/pharmacists/${id}/`,
        {
          license_status: newStatus,
          ...(newStatus === 'rejected' && { reject_message: rejectMessage })
        },
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json' 
          }
        }
      );
  
      // Update local state
      setPharmacists(prev => prev.map(p => 
        p.id === id ? { ...p, license_status: newStatus } : p
      ));
      setFilteredPharmacists(prev => prev.map(p => 
        p.id === id ? { ...p, license_status: newStatus } : p
      ));
      updateStatistics(pharmacists); // Update stats after status change
    } catch (err) {
      console.error('Failed to update pharmacist:', err);
    }
  };
  
  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page,
    }));
  };

  const getCurrentItems = () => {
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const items = filteredPharmacists.slice(startIndex, endIndex);
    console.log('Current items:', items);
    return items;
  };

  return (
    <div className="relative min-h-screen">
      <AdminLoader loading={loading} error={error} loadingMessage="Loading pharmacist requests..." />
      <div className={`container mx-auto px-4 pb-24 ${loading || error ? 'opacity-50 pointer-events-none select-none' : 'opacity-100'}`}>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 pt-6">Pharmacist Requests</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4 flex flex-col">
            <div className="overflow-y-auto pb-4" style={{ maxHeight: 'calc(100vh - 220px)' }}>
              {filteredPharmacists.length === 0 && !loading ? (
                <div className="bg-white p-10 rounded-lg shadow text-center flex flex-col items-center justify-center gap-4 text-gray-500">
                  <Inbox className="w-20 h-20 text-gray-300" />
                  <p className="text-lg font-medium text-gray-600">No pharmacists found</p>
                  <p className="text-sm text-gray-400">Try adjusting the filters to see different results.</p>
                </div>
              ) : (
                <div className="space-y-4 pr-2">
                  {getCurrentItems().map(pharmacist => (
                    <PharmacistRequestCard
                      key={pharmacist.id}
                      pharmacist={pharmacist}
                      onClick={() => setSelectedPharmacist(pharmacist)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/4 space-y-4 sticky top-6 h-fit">
            <PharmacistFilter onFilterChange={handleFilterChange} />
            <SummaryStatisticsCard stats={stats} />
          </div>
        </div>
      </div>
      {filteredPharmacists.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-3">
          <div className="container mx-auto px-2">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
      {selectedPharmacist && (
        <PharmacistModal
          pharmacist={selectedPharmacist}
          onClose={() => setSelectedPharmacist(null)}
          onConfirm={handleUpdatePharmacist}
        />
      )}
    </div>
  );
};

export default PharmacistRequestsPage;