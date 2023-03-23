import React from "react"
import { navigate } from 'gatsby';


export default function DirectoryDropDown({programDepartments, ...props}) {
    const handleDropdownChange = (e) => {
        const { value } = e.target;
        navigate(value);
      };

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
        <select onChange={handleDropdownChange} defaultValue={'DEFAULT'}>
          <option value="DEFAULT" disabled>
            Chose a department
          </option>
          {alphaPrograms.map(department => (
            <option key={department.uri} value={department.uri}>
              {department.name}
            </option>
          ))}
        </select>
    );
}
