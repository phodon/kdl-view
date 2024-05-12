import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
    const [checkboxes, setCheckboxes] = useState([
        { label: "Day", checked: false },
        { label: "Month", checked: false },
        { label: "Quarter", checked: false },
        { label: "Year", checked: false },
        { label: "Product", checked: false },
        { label: "Customer", checked: false },
        { label: "State", checked: false },
        { label: "Office", checked: false }
    ]);
    const [tableData, setTableData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [chartData1, setChartData1] = useState([]);

    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...checkboxes];
        updatedCheckboxes[index].checked = !updatedCheckboxes[index].checked;
        setCheckboxes(updatedCheckboxes);
    };

    const handleViewButtonClick = () => {
        const checkedItems = checkboxes.filter(item => item.checked);
        const dataToSend = checkedItems.map(item => item.label);

        axios.post('http://127.0.0.1:8000/api/home/', dataToSend, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                console.log('Data sent successfully:', response.data);
                setTableData(response.data);
                setShowTable(true);
                console.log(response.data)

                // Process response data to fit chart data structure
                const chartData = response.data.map(item => {
                    // Tạo một mảng chứa các thuộc tính không phải null
                    const nameArray = [];
                    if (item.Day !== null) nameArray.push(item.Day);
                    if (item.Month !== null) nameArray.push(item.Month);
                    if (item.Quarter !== null) nameArray.push(item.Quarter);
                    if (item.Year !== null) nameArray.push(item.Year);
                    if (item.State !== null) nameArray.push(item.State);
                    if (item.Office !== null) nameArray.push(item.Office);
                    if (item.Customer !== null) nameArray.push(item.Customer);
                    if (item.Product !== null) nameArray.push(item.Product);

                    // Tạo tên từ các thuộc tính không phải null
                    const name = nameArray.join('-');

                    // Trả về đối tượng mới
                    return {
                        name: name,
                        Quantity: item.quantity,
                    };
                });

                const chartData1 = response.data.map(item => {
                    // Tạo một mảng chứa các thuộc tính không phải null
                    const nameArray = [];
                    if (item.Day !== null) nameArray.push(item.Day);
                    if (item.Month !== null) nameArray.push(item.Month);
                    if (item.Quarter !== null) nameArray.push(item.Quarter);
                    if (item.Year !== null) nameArray.push(item.Year);
                    if (item.State !== null) nameArray.push(item.State);
                    if (item.Office !== null) nameArray.push(item.Office);
                    if (item.Customer !== null) nameArray.push(item.Customer);
                    if (item.Product !== null) nameArray.push(item.Product);

                    // Tạo tên từ các thuộc tính không phải null
                    const name = nameArray.join('-');

                    // Trả về đối tượng mới
                    return {
                        name: name,
                        TotalRevenue: item.TotalRevenue
                    };
                });
                setChartData(chartData);
                setChartData1(chartData1);
            })
            .catch(error => {
                console.error('Error sending request:', error);
            });
    };

    useEffect(() => {
        handleViewButtonClick();
    }, []);


    return (
        <div className='container' >
            {
                checkboxes.map((checkbox, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            checked={checkbox.checked}
                            onChange={() => handleCheckboxChange(index)}
                        />
                        <label>{checkbox.label}</label>
                    </div>
                ))
            }
            <button className="btn btn-primary" onClick={handleViewButtonClick}>View</button>
            <div style={{ margin: "50px" }}></div>
            <ResponsiveContainer width="100%" height={500} style={{ fontSize: "11.5px" }}>
                <BarChart data={chartData1} margin={{ top: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"  />
                    
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="TotalRevenue" fill="green" />
                </BarChart>
            </ResponsiveContainer>
            <div style={{ margin: "50px" }}></div>
            <ResponsiveContainer width="100%" height={500} style={{ fontSize: "11.5px" }}>
                <BarChart data={chartData} margin={{ top: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"  />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Quantity" fill="grey" />
                </BarChart>
            </ResponsiveContainer>


        </div>
    );
}

export default Header;
