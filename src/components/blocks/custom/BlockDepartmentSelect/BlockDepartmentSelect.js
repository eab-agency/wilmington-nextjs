import React, { useEffect, useState } from 'react';
import Link from '@/components/common/Link';
import {
  useQueryParamString,
  getQueryParams,
} from 'react-use-query-param-string';

const DepartmentSingle = ({ department }) => {
  const {
    name,
    description,
    programs: { nodes: directoryPrograms },
  } = department;
  // set directoryPrograms to new variable and if it's an empty array, set it to null
  const programs = directoryPrograms.length ? directoryPrograms : null;

  return (
    <div key={name}>
      <h2>{name}</h2>
      <p>{description}</p>
      {programs && (
        <>
          <h3>Programs</h3>
          <ul>
            {programs.map(program => (
              <li key={program.uri}>
                <Link href={program.uri}>{program.title}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const DepartmentListing = ({ department, ...props }) => {
  // if deparetment is null, undefined, or empty object, return null
  if (!department || Object.keys(department).length === 0) {
    return null;
  }

  // if department is an array, map over the array and return a DepartmentSingle for each department
  if (Array.isArray(department.nodes)) {
    return department.nodes.map(department => (
      <DepartmentSingle key={department.uri} department={department} />
    ));
  } else {
    // return a single DepartmentSingle
    return <DepartmentSingle department={department} />;
  }
};

const DepartmentSelector = ({
  programDepartments,
  setDepartment,
  ...props
}) => {
  const [selectedDepartment, setSelectedDepartment] = React.useState('');
  const [departmentText, setDepartmentText, initialized] = useQueryParamString(
    'department',
    ''
  );

  const handleDropdownChange = e => {
    const { value } = e.target;
    setSelectedDepartment(value);
    setDepartment(value);
    setDepartmentText(value);
  };

  // useEffect to watch for changes in the departmentText query param and set the selectedDepartment value
  useEffect(() => {
    if (departmentText) {
      setSelectedDepartment(departmentText);
      setDepartment(departmentText);
    }
  }, [departmentText, setDepartment]);

  return (
    <select onChange={handleDropdownChange} defaultValue={'DEFAULT'}>
      <option value="DEFAULT" disabled>
        Chose a department
      </option>
      <option value="ALL">Show All</option>
      {programDepartments.map(department => (
        <option key={department.uri} value={department.name}>
          {department.name}
        </option>
      ))}
    </select>
  );
};

export default function BlockDepartmentSelect({
  programDepartments,
  innerBlocks,
  ...props
}) {
  const [selectedDepartment, setSelectedDepartment] = React.useState('');
  const [selectedDepartmentInfo, setSelectedDepartmentInfo] = useState({});

  const [programDepartmentsHold, setProgramDepartmentsHold] =
    useState(programDepartments);

  // use useEffect to set the selectedDepartmentInfo, selectedDepartment values can be null, undefined, ALL, or a department name
  useEffect(() => {
    if (selectedDepartment === 'ALL') {
      setSelectedDepartmentInfo(programDepartmentsHold);
    } else if (selectedDepartment) {
      const department = programDepartmentsHold.nodes.find(
        department => department.name === selectedDepartment
      );
      setSelectedDepartmentInfo(department);
    }
  }, [selectedDepartment, programDepartmentsHold]);

  //   alphabetize the departments
  const alphaPrograms = programDepartments.nodes.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  return (
    <div>
      {/* TODO: need to figure out a way to pull in the content of this section. Andrei, we will hard code the copy for now :/ */}
      <DepartmentSelector
        programDepartments={alphaPrograms}
        setDepartment={department => setSelectedDepartment(department)}
      />
      <DepartmentListing department={selectedDepartmentInfo} />
    </div>
  );
}
