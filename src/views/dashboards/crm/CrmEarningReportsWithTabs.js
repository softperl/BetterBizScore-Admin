import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { useEffect, useState } from "react";
import axios from "axios";
const VulnChart = () => {
  const [tabData, setTabData] = useState([]);
  const getUsers = async () => {
    const token = localStorage.getItem('__token_bzc_admin');

    try {
      const response = await axios.get(`http://localhost:8000/api/subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        const payments = response.data?.data.subscriptions;

        const monthlySums = {};

        payments?.forEach(element => {
          const month = element?.startDate?.split('-')[1];
          if (!monthlySums?.[month]) {
            monthlySums[month] = 0;
          }
          monthlySums[month] += ((element?.amount / 100));
        });
        // Create an array for all months from 1 to 12
        const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

        // Fill in the corresponding values from monthlySums, use 0 if the month is not present
        const seriesData = allMonths?.map(month => monthlySums[month] || 0);

        setTabData(seriesData);
        //console.log("This is tabData", payments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);





  return (
    <div>
      <Bar
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: "Transactions ($)",
              data: tabData,
              backgroundColor: ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
              borderColor: "grey",
              borderWidth: 0.4
            },
          ]
        }}
        height={300}
        width={500}
        options={{
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          elements: {
            bar: {
              shadowColor: 'rgba(0, 0, 0, 0.5)', // Adjust the shadow color and transparency
              shadowBlur: 5, // Adjust the blur level
              shadowOffsetX: 3, // Adjust the horizontal offset
              shadowOffsetY: 3, // Adjust the vertical offset
            }
          }
        }}
      />
    </div>
  );
};
export default VulnChart;
