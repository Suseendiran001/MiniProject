import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const GradesChart = ({ students, grades, userRole }) => {
    const getBarChartData = () => {
        if (userRole === 'teacher') {
            return students
                .map(student => ({
                    name: student.name,
                    total: (student.grades?.cycleTest1 || 0) + (student.grades?.cycleTest2 || 0) + (student.grades?.assignments || 0)
                }))
                .sort((a, b) => b.total - a.total);
        } else {
            return [{
                name: 'Your Grades',
                'Cycle Test 1': grades[0]?.cycleTest1 || 0,
                'Cycle Test 2': grades[0]?.cycleTest2 || 0,
                'Assignments': grades[0]?.assignments || 0
            }];
        }
    };

    const getPieChartData = () => {
        if (userRole === 'teacher') {
            // For teachers: Show distribution of grades
            const gradeDistribution = students.reduce((acc, student) => {
                const total = (student.grades?.cycleTest1 || 0) + (student.grades?.cycleTest2 || 0) + (student.grades?.assignments || 0);
                const grade = total >= 90 ? 'O' : total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : 'F';
                acc[grade] = (acc[grade] || 0) + 1;
                return acc;
            }, {});

            return Object.entries(gradeDistribution).map(([name, value]) => ({ name, value }));
        } else {
            // For students: Show distribution of their own grades
            return [
                { name: 'Cycle Test 1', value: grades[0]?.cycleTest1 || 0 },
                { name: 'Cycle Test 2', value: grades[0]?.cycleTest2 || 0 },
                { name: 'Assignments', value: grades[0]?.assignments || 0 },
            ];
        }
    };

    const barData = getBarChartData();
    const pieData = getPieChartData();

    return (
        <div className="grades-chart">
            <div className='bar-container'>
                <h3>{userRole === 'teacher' ? 'Student Performance' : 'Your Performance'}</h3>
                <div className="bar-chart">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {userRole === 'teacher' ? (
                                <Bar dataKey="total" fill="#8884d8" barSize={30} />
                            ) : (
                                <>
                                    <Bar dataKey="Cycle Test 1" fill="#0088FE" barSize={30} />
                                    <Bar dataKey="Cycle Test 2" fill="#00C49F" barSize={30} />
                                    <Bar dataKey="Assignments" fill="#FFBB28" barSize={30} />
                                </>
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className='pie-container'>
                <h3>{userRole === 'teacher' ? 'Grade Distribution' : 'Score Distribution'}</h3>

                <div className="pie-chart">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default GradesChart;