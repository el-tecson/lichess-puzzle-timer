import Step1Img from '@/assets/static/step-1.png';
import Step2Img from '@/assets/static/step-2.png';
import Step3Img from '@/assets/static/step-3.png';
import '@/styles/About.css';
import '@/styles/HowToUse.css';

export default function HowToUsePage() {
    return (
        <>
            <h1 className="page-title">How to Use</h1>
            <div className="page-body">
                <section>
                    <h2>Step 1: Go to Lichess website</h2>
                    <img src={Step1Img} alt="step 1 image" />
                </section>
                <section>
                    <h2>Step 2: Go to Puzzles</h2>
                    <img src={Step2Img} alt="step 2 image" />
                </section>
                <section>
                    <h2>Step 3: Click the play button and start solving!</h2>
                    <img src={Step3Img} alt="step 3 image" />
                </section>
            </div>
        </>
    );
}
