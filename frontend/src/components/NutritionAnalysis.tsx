import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Target, Lightbulb, CheckCircle } from 'lucide-react';

interface NutritionAnalysisProps {
  analysis: {
    total_calories: number;
    protein_percentage: number;
    carb_percentage: number;
    fat_percentage: number;
    fiber_content: number;
    sugar_content: number;
  };
  healthAdvice: string[];
}

const NutritionAnalysis: React.FC<NutritionAnalysisProps> = ({ analysis, healthAdvice }) => {
  // Ensure we have valid data with fallbacks and format percentages to 1 decimal place
  const safeAnalysis = {
    total_calories: analysis?.total_calories || 0,
    protein_percentage: Number((analysis?.protein_percentage || 0).toFixed(1)),
    carb_percentage: Number((analysis?.carb_percentage || 0).toFixed(1)),
    fat_percentage: Number((analysis?.fat_percentage || 0).toFixed(1)),
    fiber_content: analysis?.fiber_content || 0,
    sugar_content: analysis?.sugar_content || 0
  };

  const macroData = [
    { name: 'Protein', value: safeAnalysis.protein_percentage, color: '#0ea5e9' },
    { name: 'Karbohidrat', value: safeAnalysis.carb_percentage, color: '#22c55e' },
    { name: 'Lemak', value: safeAnalysis.fat_percentage, color: '#f59e0b' }
  ];

  const nutritionData = [
    { name: 'Serat', value: safeAnalysis.fiber_content, color: '#8b5cf6' },
    { name: 'Gula', value: safeAnalysis.sugar_content, color: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{`${payload[0].payload.name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{`${payload[0].payload.name}: ${payload[0].value}g`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pt-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
          Analisis
          <span className="block gradient-text">Nutrisi Anda</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Berikut adalah rincian lengkap dari rencana nutrisi pribadi dan rekomendasi kesehatan Anda.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Macro Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Distribusi Makronutrien</h3>
              <p className="text-gray-600">Pembagian makronutrien harian</p>
            </div>
          </div>

          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {macroData.map((macro, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: macro.color }}
                ></div>
                <div className="text-sm font-medium text-gray-900">{macro.name}</div>
                <div className="text-lg font-bold text-gray-700">{macro.value}%</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Nutrition Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center mr-4">
              <TrendingUp className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Metrik Nutrisi</h3>
              <p className="text-gray-600">Nilai nutrisi utama</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
              <div className="text-3xl font-bold text-primary-700 mb-1">
                {safeAnalysis.total_calories}
              </div>
              <div className="text-sm text-primary-600">Total Kalori</div>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutritionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-success-50 rounded-lg">
                <div className="text-xl font-bold text-success-700">{safeAnalysis.fiber_content}g</div>
                <div className="text-sm text-success-600">Serat</div>
              </div>
              <div className="text-center p-3 bg-warning-50 rounded-lg">
                <div className="text-xl font-bold text-warning-700">{safeAnalysis.sugar_content}g</div>
                <div className="text-sm text-warning-600">Gula</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Health Advice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass-effect rounded-2xl p-6 px-4 sm:px-6"
      >
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center mr-4">
            <Lightbulb className="w-6 h-6 text-secondary-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Saran Kesehatan</h3>
            <p className="text-gray-600">Rekomendasi pribadi untuk kesehatan Anda</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {healthAdvice.map((advice, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              className="flex items-start space-x-3 p-4 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl"
            >
              <CheckCircle className="w-5 h-5 text-secondary-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 leading-relaxed">{advice}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NutritionAnalysis; 