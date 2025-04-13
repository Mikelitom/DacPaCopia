'use client'
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaymentCalendar() {
  // Estado para el mes y año actual
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Función para obtener el nombre del mes
  const getMonthName = (date: Date) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[date.getMonth()];
  };
  
  // Función para obtener el número de días en un mes
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Función para obtener el día de la semana del primer día del mes (0 = Domingo, 1 = Lunes, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Función para ir al mes anterior
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Función para ir al mes siguiente
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Días de la semana - utilizando índices para asegurar claves únicas
  const daysOfWeek = [
    { id: 'dom', label: 'D' },
    { id: 'lun', label: 'L' },
    { id: 'mar', label: 'M' },
    { id: 'mie', label: 'M' },
    { id: 'jue', label: 'J' },
    { id: 'vie', label: 'V' },
    { id: 'sab', label: 'S' }
  ];
  
  // Día de pago y límite de días adicionales
  const paymentDay = 10; // Por ejemplo, día 10 de cada mes
  const paymentDeadlineDays = 2; // 2 días adicionales
  
  // Función para renderizar los días del calendario
  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    
    // Crear un array para todos los días en el calendario
    const days = [];
    
    // Añadir espacios en blanco para los días antes del primer día del mes
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Añadir los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      // Comprobar si es el día de hoy
      const isToday = isCurrentMonth && today.getDate() === day;
      
      // Comprobar si es el día de pago
      const isPaymentDay = day === paymentDay;
      
      // Comprobar si es un día dentro del límite de pago (los dos días siguientes)
      const isPaymentDeadlineDay = day > paymentDay && day <= paymentDay + paymentDeadlineDays;
      
      // Determinar la clase CSS basada en el tipo de día
      let dayClass = "p-2 text-center ";
      
      if (isPaymentDay) {
        dayClass += "bg-pink-500 text-white rounded-full"; // Día de pago: rosa intenso
      } else if (isPaymentDeadlineDay) {
        dayClass += "bg-pink-200 rounded-full"; // Días límite: rosa claro
      } else if (isToday) {
        dayClass += "bg-blue-100 font-bold rounded-full"; // Día actual: azul claro
      }
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={dayClass}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-center">Próximo Pago</h2>
      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Encabezado del calendario con leyenda */}
        <div className="flex justify-between items-center mb-4">
          <button 
            className="text-gray-500 hover:text-pink-500"
            onClick={prevMonth}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold">
            {getMonthName(currentDate)} {currentDate.getFullYear()}
          </span>
          <button 
            className="text-gray-500 hover:text-pink-500"
            onClick={nextMonth}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Leyenda del calendario */}
        <div className="flex justify-center gap-4 mb-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-pink-500 rounded-full mr-1"></div>
            <span>Día de pago</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-pink-200 rounded-full mr-1"></div>
            <span>Límite de pago</span>
          </div>
        </div>
        
        {/* Días de la semana */}
        <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500">
          {daysOfWeek.map((day) => (
            <div key={day.id}>{day.label}</div>
          ))}
        </div>
        
        {/* Días del calendario */}
        <div className="grid grid-cols-7 text-center text-sm">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
}
