import { UserCard } from "./components/01.Required_Optioonal_Props"
import { GreetA, GreetB } from "./components/02.DefaultProps"
import { Panel, RequiredChildrenPanel } from "./components/03.ChildrenReactNode"
import { Badge } from "./components/04.AsConstVariables"

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

      <Badge lable="This is without variaants label"/>
      <Badge lable="this is with Variant" variant="secondary"/>
    </>
  )
}

export default App
