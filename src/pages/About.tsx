import "@/styles/About.css";
import { Link } from "react-router-dom";

export default function AboutPage() {
    return (
        <>
            <h1 className="page-title">About</h1>
            <div className="page-body">
                <section>
                    <h2>What This Extension Does</h2>
                    <p>Lichess Puzzle Timer adds a clean, automatic timer to Lichess puzzles.</p>
                    <p>It helps you track how long you take to solve each puzzle, improve your speed, and make your training more deliberate — without changing the original Lichess experience.</p>
                </section>
                <section>
                    <h2>Key Features</h2>
                    <ul>
                        <li><b>Automatic timing —</b> Starts when a puzzle loads, stops when solved.</li>
                        <li><b>Clean interface —</b> Timer appears unobtrusively on the puzzle page.</li>
                        <li><b>Popup summary —</b> Shows your time clearly once you finish.</li>
                        <li><b>Customizable behavior —</b> Toggle sound, animations, small popup, etc.</li>
                        <li><b>Lightweight —</b> No background tracking, no external servers.</li>
                    </ul>
                </section>
                <section>
                    <h2>Privacy & Permissions</h2>
                    <p>This extension:</p>
                    <ul>
                        <li><b>Collects no personal data</b></li>
                        <li><b>Sends nothing to external servers</b></li>
                        <li>Only reads the <b>puzzle elements on lichess.org</b> to detect puzzle start/finish</li>
                        <li><b>Stores settings</b> locally on your browser</li>
                    </ul>
                </section>
                <section>
                    <h2>Why I Made This</h2>
                    <p>Lichess doesn’t show puzzle-solving time by default.</p>
                    <p>Speed is a huge part of chess improvement — so I built a simple, non-intrusive timer to help players train their tactical efficiency without affecting the normal puzzle UI.</p>
                    <p>Also because I couldn't find a chrome extension like this in the Chrome Web Store.</p>
                </section>
                <section>
                    <h2>Support & Feedback</h2>
                    <p>Found a bug? Want a new feature?</p>
                    <p>You can reach me here:</p>
                    <ul>
                        <li><b>Github: </b> <Link target="_blank" to="https://github.com/el-tecson/lichess-puzzle-timer" rel="nooopener noreferrer">https://github.com/el-tecson/lichess-puzzle-timer</Link></li>
                    </ul>
                    <p>Feedback is appreciated!</p>
                </section>
                <section>
                    <h2>Credits</h2>
                    <p>Lichess Puzzle Timer is an independent, community-made project made by Emmanuel Leu Tecson and is <b>not affiliated with Lichess.org.</b></p>
                    <p>All puzzle content belongs to Lichess and the Lichess community.</p>
                </section>
            </div>
        </>
    );
}
