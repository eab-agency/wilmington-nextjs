import React from 'react';
import { FaLaptop, FaSchool } from 'react-icons/fa';
import { ReactSVG } from 'react-svg';
import { CollegeHallIcon } from "./icons";

interface ModalityIconsProps {
  modalities: string[];
}

const ModalityIcons: React.FC<ModalityIconsProps> = ({ modalities }) => {
  const modalityIcons: { [key: string]: React.ReactNode } = {
    'On Campus': <CollegeHallIcon />,
    Online: <FaLaptop />
  };

  return (
    <div className="modalityList">
      {modalities.map((modality, index) => (
        <span key={index} className="modalityCard">
          {modalityIcons[modality]}
          {index !== modalities.length - 1 && ', '}
          <span className="modalityName">{modality}</span>
        </span>
      ))}
    </div>
  );
};

export default ModalityIcons;
