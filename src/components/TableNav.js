import React from "react";
import "../stylesSheet/tableNav.css";
function TableNav({ filterByTag }) {
  // console.log("filterByTag==", filterByTag);
  return (
    <div className="TableNav">
      <ul>
        <li onClick={() => filterByTag("all")}>All</li>
        <li onClick={() => filterByTag("loss")}>Loss</li>
        <li onClick={() => filterByTag("profite")}>Profite</li>
        <li onClick={() => filterByTag("ROI")}>ROI</li>
        <li onClick={() => filterByTag("intraday")}>Intraday</li>
        {/* <li onClick={() => {}}>High</li> */}
      </ul>
    </div>
  );
}

export default TableNav;
