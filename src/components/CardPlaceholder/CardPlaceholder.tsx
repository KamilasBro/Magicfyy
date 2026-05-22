import "./cardPlaceholder.scss";

const CardPlaceholder: React.FC = () => {
  return (
    <div
      className="card-placeholder flex flex-col "
    >
      <div className="card-placeholder-img" />
      <div className="card-placeholder-content flex flex-col">
        {Array(4).fill(null).map((_, j) => (<div key={`content-${j}`} />))}
      </div>
    </div>
  );
};

export default CardPlaceholder;
