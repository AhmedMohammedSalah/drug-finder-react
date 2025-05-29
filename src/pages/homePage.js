import SmallBtn from "../components/shared/smallbtn";

function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <SmallBtn name="Click Me"
  btnColor="primary"
  onClick={() => alert('Button clicked!')}/>
      <p>This is the main page of our application.</p>
    </div>
  );
}  

export default Home;