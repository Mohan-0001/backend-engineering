import { UserCard } from "./components/01.Required_Optioonal_Props"
import { GreetA, GreetB } from "./components/02.DefaultProps"
import { Panel, RequiredChildrenPanel } from "./components/03.ChildrenReactNode"

function App() {
  return (
    <>
      {/* Required and Optional props  */}
      <UserCard id={"1"} name="mohan" subtitle={<><p>Nested P</p></>}/>

      {/* Default Porps */}
      <GreetA/>
      <GreetA name="Mohan" />
      <GreetB name= "Vanshika" />

      {/* Parsing Children */}
      <Panel title="Panel"/>
      {/* // PropsWithChildren is a ts type helper that simply tells a compont it is allowed to accept children*/}
      <RequiredChildrenPanel title="Hello">
        Some Content here 
      </RequiredChildrenPanel>
    </>
  )
}

export default App
