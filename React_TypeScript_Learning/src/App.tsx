import { UserCard } from "./components/01.Required_Optioonal_Props"
import { GreetA, GreetB } from "./components/02.DefaultProps"

function App() {
  return (
    <>
      <UserCard id={"1"} name="mohan" subtitle={<><p>Nested P</p></>}/>
      <GreetA/>
      <GreetA name="Mohan" />
      <GreetB name= "Vanshika" />
    </>
  )
}

export default App
