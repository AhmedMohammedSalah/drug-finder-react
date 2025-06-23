import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PharmacistRequestCard from '../../components/admin/PharmacistRequestCard';
import PharmacistFilter from '../../components/admin/PharmacistFilter';
import SummaryStatisticsCard from '../../components/admin/SummaryStatisticsCard';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import Pagination from '../../components/admin/Pagination';
import { Inbox } from 'lucide-react'; 

const PharmacistRequestsPage = () => {
  // ==== STATES ====
  const [pharmacists, setPharmacists] = useState([]);
  const [filteredPharmacists, setFilteredPharmacists] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // ==== FETCH PHARMACISTS ON MOUNT ====
  useEffect(() => {

    // FETCH PHARAMACIST
    const fetchPharmacists = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://localhost:8000/users/pharmacists/', {
          headers: { Authorization: `Bearer ${token}`,},
        });
        const data = res.data.results;

        //DEBUG
        console.log("data = ", data)

        setPharmacists(data);
        setFilteredPharmacists(data);
        updateStatistics(data);
        setPagination(prev => ({
          ...prev,
          totalItems: data.length
        }));
      } catch (err) {
        console.error('Failed to fetch pharmacists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacists();
  }, []);

  // ==== STATISTICS UPDATE ====
  const updateStatistics = (data) => {
    const pending = data.filter((p) => p.license_status === 'pending').length;
    const approved = data.filter((p) => p.license_status === 'approved').length;
    const rejected = data.filter((p) => p.license_status === 'rejected').length;
    

    setStats({
      pending,
      approved,
      rejected,
      total: data.length,
    });
  };

  // ==== FILTER HANDLER ====
  const handleFilterChange = (filters) => {
    let filtered = [...pharmacists];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter((p) => p.license_status === filters.status);
    }
    

    // Sort
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
      totalItems: filtered.length
    }));
  };

  // ==== ACTION HANDLER ====
  const handleAction = async (id, action) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');

      await axios.patch(
        `http://localhost:8000/users/pharmacists/${id}/approval/`,
        { is_approved: action === 'approve' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = pharmacists.map((p) =>
        p.id === id ? { ...p, is_approved: action === 'approve' } : p
      );

      setPharmacists(updated);
      setFilteredPharmacists(updated);
      updateStatistics(updated);
      setPagination(prev => ({
        ...prev,
        totalItems: updated.length
      }));
    } catch (err) {
      console.error(`Failed to ${action} pharmacist:`, err);
    } finally {
      setLoading(false);
    }
  };

  // ==== PAGINATION HANDLERS ====
  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const handleItemsPerPageChange = (itemsPerPage) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage,
      currentPage: 1
    }));
  };

  // ==== GET CURRENT ITEMS FOR PAGINATION ====
  const getCurrentItems = () => {
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPharmacists.slice(startIndex, endIndex);
  };

  // ==== JSX ====
  return (
    <div className="relative min-h-screen">
      {/* Loading Overlay */}
      {loading && <LoadingOverlay />}

      {/* Content Container */}
      <div
        className={`container mx-auto px-4 pb-24 transition-opacity duration-300 ${
          loading ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 pt-6">Pharmacist Requests</h1>

        {/* Main Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Pharmacist Cards Container */}
          <div className="lg:w-3/4 flex flex-col">
            {/* Scrollable Requests Window with padding bottom for pagination */}
            <div className="overflow-y-auto pb-4" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            {filteredPharmacists.length === 0 && !loading ? (
              <div className="bg-white p-10 rounded-lg shadow text-center flex flex-col items-center justify-center gap-4 text-gray-500">
                {/* Big Icon */}
                <Inbox className="w-20 h-20 text-gray-300" /> {/* BIG Lucide Inbox Icon */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z" />
         

                {/* Friendly Message */}
                <p className="text-lg font-medium text-gray-600">No pharmacists found</p>
                <p className="text-sm text-gray-400">Try adjusting the filters to see different results.</p>
              </div>
            ) : (
              <div className="space-y-4 pr-2">
                {getCurrentItems().map((pharmacist) => (
                  <PharmacistRequestCard
                    key={pharmacist.id}
                    pharmacist={pharmacist}
                    onAction={handleAction}
                  />
                ))}
              </div>
            )}

            </div>
          </div>

          {/* Fixed Filter and Stats Section */}
          <div className="lg:w-1/4 space-y-4 sticky top-6 h-fit">
            <PharmacistFilter onFilterChange={handleFilterChange} />
            
            {/* Vertical Stats Cards */}
            <SummaryStatisticsCard stats={stats} />
          </div>
        </div>
      </div>

      {/* Fixed Pagination at Bottom */}
      {filteredPharmacists.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-3">
          <div className="container mx-auto px-4">
            <Pagination
              currentPage={pagination.currentPage}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={pagination.totalItems}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacistRequestsPage;