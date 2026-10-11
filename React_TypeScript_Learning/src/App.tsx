import { UserCard } from "./components/01.Required_Optioonal_Props"

function App() {
  return (
    <>
      <UserCard id={"1"} name="mohan" subtitle={<><p>Nested P</p></>}/>
    </>
  )
}

export default App
