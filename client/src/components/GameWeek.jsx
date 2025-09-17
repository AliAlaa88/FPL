import "./GameWeek.css";

const GameWeek = ({ currentGW, onPrevious, onNext, maxGW }) => {
  return (
    <div className="gw">
      <button 
        className="gw-nav-btn" 
        onClick={onPrevious}
        disabled={currentGW <= 1}
      >
        ←
      </button>
      <div className="gw-content">
        <span className="gw-number">{currentGW}</span>
      </div>
      <button 
        className="gw-nav-btn" 
        onClick={onNext}
        disabled={currentGW >= maxGW}
      >
        →
      </button>
    </div>
  );
};

export default GameWeek;
