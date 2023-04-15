import {
  Loader,
  Navbar,
  Footer,
  Services,
  Transactions,
  Welcome,
} from "./components";

export default function App() {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome h-screen">
        <Navbar />
        <Welcome />
      </div>
      {/* <Services />
      <Transactions />
      <Footer /> */}
    </div>
  );
}
