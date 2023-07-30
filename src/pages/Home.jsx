import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import RowSection from "../components/RowSection";

export default function Home() {
  let [content, setContents] = useState([]);
  useEffect(() => {
    let task = async () => {
      let resp = await fetch(`${API_URL}/home?populate=*`);
      let data = await resp.json();
      // console.log(data)

      let content = data.data.attributes.content;

      setContents(content);
    };

    task();
  }, []);

  return (
    <div className="py-6">
      <main>
        <div className="mx-auto sm:px-6 flex flex-col space-y-20 lg:px-8">
          {content.map((v) => (
            <RowSection name={v.name} action={v.action_url} />
          ))}
        </div>
      </main>
    </div>
  );
}