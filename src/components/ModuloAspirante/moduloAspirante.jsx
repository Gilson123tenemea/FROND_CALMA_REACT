import React, { useState, useEffect } from 'react'; 
import { useLocation } from 'react-router-dom'; 
import './moduloAspirante.css'; 

const ModuloAspirante = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: 'Anywhere',
    careType: 'Any',
    recommendation: 'All',
    datePosted: 'Any time',
    salaryRange: [20, 50]
  });

  const jobListings = [
    {
      id: 1,
      title: "Caregiver for Elderly Woman",
      description: "Seeking a compassionate caregiver for an elderly woman in her home. Responsibilities include meal preparation, medication reminders, and companionship.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLyUy5N1ORezkLmzXRDiOtBGV6yyyjKQqkJMk7v1q5JT_7p4YrnT7hfzuxT1-X4l6iEoYCanZ2mPkH4rXk3-s6zGredlUT98vrsMFZTB0ERWmAEpUDhQST2wtLoXIYyIJU3VKXjuRAWtI2WQbCmB75YRI9zqSxbrnVrDZhU3ktS4xU7nfr4oeZBNitL6EWbSDqaRniMtKc1CUhQFjmUeOiv7fMu8JyHKS4EOQnEPIw8erAWE1r41DndBh_pHmmiR3TjYKqTmkRXFQ",
      datePosted: "2 days ago",
      recommendations: 5
    },
    {
      id: 2,
      title: "Part-Time Companion for Senior Man",
      description: "Looking for a part-time companion for a senior man who enjoys light activities and conversation. Flexible hours available.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVJs2m-RhMUbT-C143m49BYH_EO4_UHbjI5YPbHGHUYnNDZN-XIAFPlCHANXMvg4xcA51FUbIQY7jyG8U52UmXOhIxQGmUdydIKfN9h4lHoipbfV1Eq-XErfxCd7G1arnFIRAXpspDjGcKP9tOYmCLdavYQnWcHoXwPZfkUxiYlWFVeo52FsY49fl80kyoguzRsf_CzXzzq6107DdcLNOTleHBrQajsO-TUP6XPJWxa31wSOUysTAuSCI8f3IWnXz_7y8Bxq29MyM",
      datePosted: "1 week ago",
      recommendations: 3
    },
    {
      id: 3,
      title: "Live-In Caregiver for Elderly Couple",
      description: "Seeking a live-in caregiver for an elderly couple. Duties include personal care, light housekeeping, and transportation to appointments.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXvcVxQiAnc5VriIfwruqJOm_RQSZm7ZviQcmuGuOneNbFibclolox6n8FMqoFWenVovQaojGel_QosvqHI6N8CUkykQfOTE109RYw5WuVj2fsfbEmOma6mGuH2FXLqt5y8YUQCZfywLl_TQXHTWiHp8XoE2WIpnGp7cVHAm7LE5AFLci2L7dcnLP2uH7Cfmyozt6rl1-ahuMwUcdf2PQLucGBQLg8jB4nuMw-XCWw8tdnxGFRHgBxi0xYD3khal_jRZeV1C_ySu8",
      datePosted: "3 days ago",
      recommendations: 8
    },
    {
      id: 4,
      title: "Weekend Caregiver for Senior Woman",
      description: "Looking for a weekend caregiver for a senior woman. Responsibilities include meal preparation, medication reminders, and companionship.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDp8FQw-lAZgQwJOHddh78099XUa934kC82jA-ber_p51u3xNgAKxDxj2wd9pBzm_2RVTxvFkknerNGYNFR-sRHUpF7bi8oFCgWJ1iNMjvArP9xJFSE8rjAocw3QfAdnl9oQDPKGBfitepNlMNXif1qFUsg3JgncDLW8J5dsIVeLSogJ4jtahShi0R-1rvMOUwOraDRAe8ZmO0Sg-GLNuHOGq1hGiY1iRMdRSq6TPdHYwpPXaF7SrJiXkVHGmFFXElrgQ-WSCtDOlA",
      datePosted: "Just now",
      recommendations: 2
    }
  ];

  useEffect(() => {
    // Opción 1: Desde el estado de navegación (si se pasó al navegar)
    if (location.state?.userId) {
      console.log("ID del aspirante (desde state):", location.state.userId);
    }

    // Opción 2: Desde localStorage (como respaldo)
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.usuarioId) {
      console.log("ID del aspirante (desde localStorage):", userData.usuarioId);
    }
  }, [location.state]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalaryChange = (index, value) => {
    const newSalaryRange = [...filters.salaryRange];
    newSalaryRange[index] = parseInt(value);
    setFilters(prev => ({
      ...prev,
      salaryRange: newSalaryRange
    }));
  };

  const filteredJobs = jobListings.filter(job => {
    // Filter by search term
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by recommendation
    if (filters.recommendation !== 'All') {
      const minRec = parseInt(filters.recommendation);
      if (job.recommendations < minRec) {
        return false;
      }
    }
    
    // Filter by date posted (simplified for demo)
    if (filters.datePosted !== 'Any time') {
      if (filters.datePosted === 'Last 24 hours' && !job.datePosted.includes('hours')) {
        return false;
      }
      if (filters.datePosted === 'Last week' && !job.datePosted.includes('week')) {
        return false;
      }
      if (filters.datePosted === 'Last month' && !job.datePosted.includes('month')) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="modulo-aspirante">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                fill="currentColor"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                fill="currentColor"
              ></path>
            </svg>
            <h2>SeniorConnect</h2>
          </div>
          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="#">My Network</a>
            <a href="#">Jobs</a>
            <a href="#">Messaging</a>
            <a href="#">Notifications</a>
            <a href="#">Me</a>
          </nav>
        </div>
        <div className="header-right">
          <div className="search-bar">
            <div className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="user-avatar" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC7xYeLgJw3HPuf8tUUBOx1JHnFFX4gdCdA8VqdY-DYJa-LG5ZJcdBGSet6h-kNMEYn0QQxnamguLQikjX8kePCzu93nzRd6hAzgyZKqio9beS5lzd--RPEo1e6M3c6dZowOKDssqZ-oMPRCtD4DjrHwLTrComL16-y7v1RnNfYoYXZNW3jypW5Q1nsSfGEzbaaLS5vMkW5KLUoA0t2aolswTQxmvbb3N4AoSTffpTChIWOhz3ZnPu17U7DIHm5YWpMrOBsE98O5R0")'}}></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <h2>Filters</h2>
          
          <div className="filter-group">
            <label>Location</label>
            <select 
              name="location" 
              value={filters.location} 
              onChange={handleFilterChange}
            >
              <option value="Anywhere">Anywhere</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
              <option value="Houston">Houston</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Type of Care</label>
            <select 
              name="careType" 
              value={filters.careType} 
              onChange={handleFilterChange}
            >
              <option value="Any">Any</option>
              <option value="Elderly Care">Elderly Care</option>
              <option value="Disability Care">Disability Care</option>
              <option value="Post-Surgery Care">Post-Surgery Care</option>
              <option value="Companionship">Companionship</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Recommendation Score</label>
            <select 
              name="recommendation" 
              value={filters.recommendation} 
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Date Posted</label>
            <select 
              name="datePosted" 
              value={filters.datePosted} 
              onChange={handleFilterChange}
            >
              <option value="Any time">Any time</option>
              <option value="Last 24 hours">Last 24 hours</option>
              <option value="Last week">Last week</option>
              <option value="Last month">Last month</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Salary Expectation (${filters.salaryRange[0]} - ${filters.salaryRange[1]}/hr)</label>
            <div className="salary-slider">
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={filters.salaryRange[0]} 
                onChange={(e) => handleSalaryChange(0, e.target.value)}
              />
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={filters.salaryRange[1]} 
                onChange={(e) => handleSalaryChange(1, e.target.value)}
              />
              <div className="slider-track">
                <div className="slider-range" style={{
                  left: `${(filters.salaryRange[0] - 10) / 90 * 100}%`,
                  width: `${(filters.salaryRange[1] - filters.salaryRange[0]) / 90 * 100}%`
                }}></div>
              </div>
            </div>
          </div>
          
          <button className="apply-filters">Apply Filters</button>
        </div>
        
        {/* Job Listings */}
        <div className="job-listings">
          <h1>Job Listings</h1>
          
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-content">
                  <div className="job-info">
                    <h3>{job.title}</h3>
                    <p>{job.description}</p>
                    <div className="job-meta">
                      <span className="recommendations">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFD700" viewBox="0 0 256 256">
                          <path d="M239.2,97.4A16.4,16.4,0,0,0,224.6,86l-59.4-4.1-22-55.5A16.4,16.4,0,0,0,128,16h0a16.4,16.4,0,0,0-15.2,10.4L90.4,82.2,31.4,86A16.5,16.5,0,0,0,16.8,97.4,16.8,16.8,0,0,0,22,115.5l45.4,38.4L53.9,207a18.5,18.5,0,0,0,7,19.6,18,18,0,0,0,20.1.6l46.9-29.7h.2l50.5,31.9a16.1,16.1,0,0,0,8.7,2.6,16.5,16.5,0,0,0,15.8-20.8l-14.3-58.1L234,115.5A16.8,16.8,0,0,0,239.2,97.4Z"></path>
                        </svg>
                        {job.recommendations} recommendations
                      </span>
                      <span className="date-posted">Posted {job.datePosted}</span>
                    </div>
                  </div>
                  <button className="view-details">View Details</button>
                </div>
                <div 
                  className="job-image" 
                  style={{backgroundImage: `url(${job.image})`}}
                ></div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#999" viewBox="0 0 256 256">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-16-56a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Z"></path>
              </svg>
              <h3>No jobs found matching your criteria</h3>
              <p>Try adjusting your filters or search term</p>
            </div>
          )}
          
          {/* Pagination */}
          <div className="pagination">
            <button className="pagination-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
              </svg>
            </button>
            <button className="pagination-button active">1</button>
            <button className="pagination-button">2</button>
            <button className="pagination-button">3</button>
            <button className="pagination-button">4</button>
            <button className="pagination-button">5</button>
            <button className="pagination-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuloAspirante;