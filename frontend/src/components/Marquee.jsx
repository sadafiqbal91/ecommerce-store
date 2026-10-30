const words = ["Oud", "Amber", "Musk", "Rose", "Saffron", "Vanilla", "Sandalwood", "Jasmine"];

export default function Marquee() {
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div className="marquee-row" key={k}>
            {words.concat(words).map((w, i) => (
              <span key={i}>
                {w}
                <i>*</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
