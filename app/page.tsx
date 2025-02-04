import { About } from "./components/About/About";
import { Activity } from "./components/Activity/Activity";
import { Contact } from "./components/Contact/Contact";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { Skill } from "./components/Skill/Skill";
import { Work } from "./components/Work/Work";

export default function Home() {
    return (
        <>
            <Header />
            <About />
            <Work />
            <Skill />
            <Activity />
            <Contact />
            <Footer />
        </>
    );
}
