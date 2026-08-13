import "./NoItem.css";
export const NoItem = ({name}) => {
  return (
    <div className="no-subcategories">
      <p>No {name} available.</p>
    </div>
  );
};
