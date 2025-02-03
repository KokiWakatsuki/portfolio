import { About } from "./components/About/About";
import { Activity } from "./components/Activity/Activity";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { Skill } from "./components/Skill/Skill";

export default function Home() {
    return (
        <>
            <Header />
            <About />
            <Skill />
            <Activity />
            <Footer />
        </>
    );
}
