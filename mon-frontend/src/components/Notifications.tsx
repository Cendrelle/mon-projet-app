import { useEffect, useState } from "react";

const Notifications = () => {
  const [avisAvecReponse, setAvisAvecReponse] = useState<any[]>([]);

  useEffect(() => {
    const fetchReponses = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/avis/"); // route publique qui renvoie les avis du client
        const data = await res.json();
        // garder uniquement ceux qui ont une réponse
        setAvisAvecReponse(data.filter((a: any) => a.reponse));
      } catch (err) {
        console.error(err);
      }
    };

    fetchReponses();
    const interval = setInterval(fetchReponses, 30000); // refresh toutes les 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button className="relative">
        🔔
        {avisAvecReponse.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
            {avisAvecReponse.length}
          </span>
        )}
      </button>

      {/* Liste déroulante */}
      {avisAvecReponse.length > 0 && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border rounded">
          {avisAvecReponse.map((avis) => (
            <div key={avis.id} className="p-2 border-b">
              <p className="font-bold">{avis.client?.username || "Invité"}</p>
              <p>Réponse : {avis.reponse}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
