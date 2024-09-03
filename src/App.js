import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

function App() {
  const [data, setData] = useState({
    givers: [],
    takers: [],
    deliverers: [],
    deliveries: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust this to the number of items you want per page

  useEffect(() => {
    const unsubscribeGivers = onSnapshot(
      collection(db, 'givers'),
      (snapshot) => {
        console.log('Givers snapshot fetched:', snapshot); // Log the snapshot to debug
        const giversData = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Giver document data:', data); // Log raw data for each document

          // Handle Firestore timestamp
          const formattedDate = formatTimestamp(data.timestamp);

          return {
            id: doc.id,
            ...data,
            formattedDate
          };
        });
        console.log('Givers data processed:', giversData);
        setData(prevData => ({ ...prevData, givers: giversData }));
      },
      (error) => {
        console.error('Error fetching givers documents:', error);
      }
    );

    const unsubscribeTakers = onSnapshot(
      collection(db, 'takers'),
      (snapshot) => {
        console.log('Takers snapshot fetched:', snapshot); // Log the snapshot to debug
        const takersData = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Taker document data:', data); // Log raw data for each document

          // Handle Firestore timestamp
          const formattedDate = formatTimestamp(data.timestamp);

          return {
            id: doc.id,
            ...data,
            formattedDate
          };
        });
        console.log('Takers data processed:', takersData);
        setData(prevData => ({ ...prevData, takers: takersData }));
      },
      (error) => {
        console.error('Error fetching takers documents:', error);
      }
    );

    // Cleanup the subscriptions on unmount
    return () => {
      unsubscribeGivers();
      unsubscribeTakers();
    };
  }, []);

  function formatTimestamp(timestamp) {
    if (timestamp && timestamp.seconds !== undefined) {
      const seconds = timestamp.seconds;
      const nanoseconds = timestamp.nanoseconds || 0;
      const date = new Date(seconds * 1000 + nanoseconds / 1000000);

      return date.toLocaleString('en-US', {
        timeZone: 'Asia/Singapore',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      });
    } else {
      console.error('Timestamp field missing or invalid:', timestamp);
      return 'Invalid timestamp';
    }
  }

  // Calculate the data to display based on the current page
  const paginate = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className='bg-white'>
      <div className='flex flex-row justify-center gap-20'>
        {/* Givers */}
        <div className='w-[300px] ml-8'>
          <h1 className='text-[28px] mt-5 mb-5 border border-2 border-black rounded-[10px] text-center'>Givers</h1>
          <ul>
            {paginate(data.givers).map(giver => (
              <li key={giver.id} className='border border-green-400 border-2 rounded-[10px] mt-5 mb-5 p-5 '>
                <li>Name: {giver.name}</li>
                <li>Cooked: {giver.cooked ? 'Yes' : 'No'}</li> 
                <li>Diet Type: {giver['diet-type']}</li>
                <li>Exp Date: {formatTimestamp(giver.expdate)}</li>
                <li>Type: {giver.type}</li>
                <li>Formatted Date: {giver.formattedDate}</li>
              </li>
            ))}
          </ul>
          {/* Pagination Controls */}
          <div className="flex justify-center">
            {Array(Math.ceil(data.givers.length / itemsPerPage)).fill().map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border ${index + 1 === currentPage ? 'bg-gray-300' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Similar structure for Takers, Deliverers, Deliveries */}
        <div className='w-[300px]'>
          <h1 className='text-[28px] mt-5 mb-5 border border-2 border-black rounded-[10px] text-center'>Takers</h1>
          <ul>
            {paginate(data.takers).map(taker => (
              <li key={taker.id} className='border border-red-400 border-2 rounded-[10px] mt-5 mb-5 p-5 '>
                <li>Name: {taker.nameTaker}</li>
                <li>Diet Req: {taker.dietReq}</li>
                <li>Family Pax: {taker.familyPax}</li>
                <li>House Income: ${taker.houseIncome}</li>
                <li>Plan Type: {taker.planType}</li>
                <li>Formatted Date: {taker.formattedDate}</li>
              </li>
            ))}
          </ul>
          {/* Pagination Controls */}
          <div className="flex justify-center">
            {Array(Math.ceil(data.takers.length / itemsPerPage)).fill().map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border ${index + 1 === currentPage ? 'bg-gray-300' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        
        <div className='w-[300px]'>
          <h1 className='text-[28px] mt-5 mb-5 border border-2 border-black rounded-[10px] text-center'>Deliverers</h1>
          <ul>
            {paginate(data.deliverers).map(deliverer => (
              <li key={deliverer.id} className='border border-red-400 border-2 rounded-[10px] mt-5 mb-5 p-5 '>
                <li>Name: {deliverer.nameDeliverer}</li>
                <li>Role: {deliverer.role}</li>
                <li>Formatted Date: {deliverer.formattedDate}</li>
              </li>
            ))}
          </ul>
          {/* Pagination Controls */}
          <div className="flex justify-center">
            {Array(Math.ceil(data.deliverers.length / itemsPerPage)).fill().map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border ${index + 1 === currentPage ? 'bg-gray-300' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className='w-[300px]'>
          <h1 className='text-[28px] mt-5 mb-5 border border-2 border-black rounded-[10px] text-center'>Deliveries</h1>
          <ul>
            {paginate(data.deliveries).map(delivery => (
              <li key={delivery.id} className='border border-red-400 border-2 rounded-[10px] mt-5 mb-5 p-5 '>
                <li>Name and Role: {delivery.nameAndRole}</li>
                <li>Order Summary: {delivery.orderSummary}</li>
              </li>
            ))}
          </ul>
          {/* Pagination Controls */}
          <div className="flex justify-center">
            {Array(Math.ceil(data.deliveries.length / itemsPerPage)).fill().map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border ${index + 1 === currentPage ? 'bg-gray-300' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
