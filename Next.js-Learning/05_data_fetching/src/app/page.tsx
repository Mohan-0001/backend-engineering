import next from "next";
import Image from "next/image";

export default async function Home() {

  // == ssr==
  // const response = await fetch("http://localhost:3000/api/user", {cache:'no-store'});
  // const data =await response.json();
  

  // == ssg ===
  // const response = await fetch("http://localhost:3000/api/user", {cache: 'force-cache'});
  // const data = await response.json();

  //=== isr ===
    const response = await fetch("http://localhost:3000/api/user",{
      next: { revalidate: 20}
    }
    );
  const data = await response.json();
  return (
    <div>
      Hello Ji
      Fetch data : {JSON.stringify(data)}
    </div>
  );
}
 