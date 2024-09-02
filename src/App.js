import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

function App() {
  const [data, setData] = useState({
    givers: [],
    takers: [],
    volunteers: [], // If you have volunteers collection data, include it here.
  });

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

  // Utility function to format Firestore timestamp
  function formatTimestamp(timestamp) {
    if (timestamp && timestamp.seconds !== undefined) {
      const seconds = timestamp.seconds;
      const nanoseconds = timestamp.nanoseconds || 0;
      const date = new Date(seconds * 1000 + nanoseconds / 1000000); // Convert to milliseconds

      return date.toLocaleString('en-US', {
        timeZone: 'Asia/Singapore', // Adjust as needed
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

  return (
    <div>
      <h1>Givers</h1>
      <ul>
        {data.givers.map(giver => (
          <li key={giver.id}>
            Name: {giver.name} - 
            Cooked: {giver.cooked ? 'Yes' : 'No'} - 
            Diet Type: {giver['diet-type']} - 
            Exp Date: {formatTimestamp(giver.expdate)} - 
            Type: {giver.type} - 
            Formatted Date: {giver.formattedDate}
          </li>
        ))}
      </ul>
      
      <h1>Takers</h1>
      <ul>
        {data.takers.map(taker => (
          <li key={taker.id}>
            Name: {taker.nameTaker} - 
            Diet Req: {taker.dietReq} - 
            Family Pax: {taker.familyPax} - 
            House Income: ${taker.houseIncome} - 
            Plan Type: {taker.planType} - 
            Formatted Date: {taker.formattedDate}
          </li>
        ))}
      </ul>
      
      <ul>
        {data.volunteers.map(volunteer => (
          <li key={volunteer.id}>
            {volunteer.name} - {volunteer.formattedDate}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
