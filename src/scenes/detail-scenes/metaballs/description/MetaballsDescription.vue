<script setup>
import { descriptionText, formatNumber } from './description_format.js';
import {
    THRESHOLD, FIRST_BALL, SECOND_BALL, TEST_POINT, SINGLE_BALL, TWO_BALLS, FIRST_DISTANCE, SECOND_DISTANCE, SINGLE_BALL_POTENTIAL, TWO_BALLS_POTENTIAL,
} from './metaball_example.js';
import MetaballFieldDiagram from './MetaballFieldDiagram.vue';
import DistanceCalculation from './DistanceCalculation.vue';
</script>

<template>
    <section>
        <h3>{{ descriptionText('field_heading') }}</h3>
        <p>{{ descriptionText('field_text_1') }}</p>
        <math display="block">
            <msub><mi>f</mi><mi>i</mi></msub><mo>(</mo><mi>p</mi><mo>)</mo>
            <mo>=</mo>
            <msub><mi>φ</mi><mi>i</mi></msub><mo>(</mo><msub><mi>r</mi><mi>i</mi></msub><mo>)</mo>
            <mo>,</mo>
            <mspace width="1.5em" />
            <msub><mi>r</mi><mi>i</mi></msub>
            <mo>=</mo>
            <mo>‖</mo><mi>p</mi><mo>−</mo><msub><mi>c</mi><mi>i</mi></msub><mo>‖</mo>
        </math>
        <p>{{ descriptionText('field_text_2') }}</p>
        <ul class="falloff-functions">
            <li>
                <span class="formula"><math displaystyle="true"><msub><mi>φ</mi><mi>i</mi></msub><mo>(</mo><mi>r</mi><mo>)</mo><mo>=</mo><mfrac><msub><mi>a</mi><mi>i</mi></msub><mi>r</mi></mfrac></math></span>
                <span>{{ descriptionText('falloff_reciprocal') }}</span>
            </li>
            <li>
                <span class="formula"><math displaystyle="true"><msub><mi>φ</mi><mi>i</mi></msub><mo>(</mo><mi>r</mi><mo>)</mo><mo>=</mo><mfrac><msub><mi>a</mi><mi>i</mi></msub><msup><mi>r</mi><mn>2</mn></msup></mfrac></math></span>
                <span>{{ descriptionText('falloff_inverse_square') }}</span>
            </li>
            <li>
                <span class="formula"><math displaystyle="true">
                    <msub><mi>φ</mi><mi>i</mi></msub><mo>(</mo><mi>r</mi><mo>)</mo><mo>=</mo>
                    <msub><mi>a</mi><mi>i</mi></msub><mo>⁢</mo>
                    <msup><mi>e</mi><mrow><mo>−</mo><msub><mi>b</mi><mi>i</mi></msub><mo>⁢</mo><msup><mi>r</mi><mn>2</mn></msup></mrow></msup>
                </math></span>
                <span>{{ descriptionText('falloff_gaussian') }}</span>
            </li>
            <li>
                <span class="formula"><math displaystyle="true">
                    <msub><mi>φ</mi><mi>i</mi></msub><mo>(</mo><mi>r</mi><mo>)</mo><mo>=</mo>
                    <mi>max</mi><mo>(</mo><mn>0</mn><mo>,</mo>
                    <mfrac><msub><mi>a</mi><mi>i</mi></msub><msup><mi>r</mi><mn>2</mn></msup></mfrac>
                    <mo>−</mo><msub><mi>k</mi><mi>i</mi></msub><mo>)</mo>
                </math></span>
                <span>{{ descriptionText('falloff_clamped') }}</span>
            </li>
        </ul>
        <p>{{ descriptionText('field_text_3') }}</p>
    </section>

    <section>
        <h3>{{ descriptionText('isosurface_heading') }}</h3>
        <p>{{ descriptionText('isosurface_text_1') }}</p>
        <math display="block">
            <mi>F</mi><mo>(</mo><mi>p</mi><mo>)</mo>
            <mo>=</mo>
            <munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover>
            <msub><mi>f</mi><mi>i</mi></msub><mo>(</mo><mi>p</mi><mo>)</mo>
        </math>
        <p>{{ descriptionText('isosurface_text_2') }}</p>
        <math display="block">
            <mi>F</mi><mo>(</mo><mi>p</mi><mo>)</mo><mo>≥</mo><mi>τ</mi>
            <mspace width="1.5em" />
            <mi>S</mi><mo>=</mo><mo>{</mo><mi>p</mi><mo>|</mo><mi>F</mi><mo>(</mo><mi>p</mi><mo>)</mo><mo>=</mo><mi>τ</mi><mo>}</mo>
        </math>
    </section>

    <section>
        <h3>{{ descriptionText('example_heading') }}</h3>
        <p>{{ descriptionText('example_text') }}</p>
        <div class="formula-line">
            <math displaystyle="true">
                <mi>τ</mi><mo>=</mo><mn>{{ formatNumber(THRESHOLD) }}</mn><mo>,</mo>
                <mspace width="1.5em" />
                <mi>φ</mi><mo>(</mo><mi>r</mi><mo>)</mo><mo>=</mo><mfrac><mn>1</mn><mi>r</mi></mfrac>
            </math>
        </div>

        <h4>{{ descriptionText('single_ball_heading') }}</h4>
        <ol class="example-steps">
            <li>
                <p>{{ descriptionText('single_ball_step_1') }}</p>
                <div class="formula-line">
                    <math displaystyle="true">
                        <mi>F</mi><mo>(</mo><mi>p</mi><mo>)</mo><mo>=</mo><mfrac><mn>1</mn><msub><mi>r</mi><mn>1</mn></msub></mfrac><mo>,</mo>
                        <mspace width="1.5em" />
                        <msub><mi>r</mi><mn>1</mn></msub><mo>=</mo><mo>‖</mo><mi>p</mi><mo>−</mo><msub><mi>c</mi><mn>1</mn></msub><mo>‖</mo>
                    </math>
                </div>
            </li>
            <li>
                <p>{{ descriptionText('single_ball_step_2') }}</p>
                <div class="formula-line">
                    <math displaystyle="true">
                        <mi>F</mi><mo>(</mo><mi>p</mi><mo>)</mo><mo>≥</mo><mi>τ</mi>
                        <mspace width="0.8em" /><mo>⇔</mo><mspace width="0.8em" />
                        <mfrac><mn>1</mn><msub><mi>r</mi><mn>1</mn></msub></mfrac><mo>≥</mo><mn>{{ formatNumber(THRESHOLD) }}</mn>
                    </math>
                </div>
            </li>
            <li>
                <p>{{ descriptionText('single_ball_step_3') }}</p>
                <div class="formula-line">
                    <math displaystyle="true">
                        <msub><mi>r</mi><mn>1</mn></msub><mo>≤</mo><mfrac><mn>1</mn><mn>{{ formatNumber(THRESHOLD) }}</mn></mfrac><mo>≈</mo><mn>{{ formatNumber(1 / THRESHOLD) }}</mn>
                    </math>
                </div>
            </li>
            <li>
                <p>{{ descriptionText('single_ball_step_4') }}</p>
                <div class="formula-line">
                    <DistanceCalculation :point="TEST_POINT" :center="FIRST_BALL" :center_index="1" />
                </div>
            </li>
            <li>
                <p>{{ descriptionText('single_ball_step_5') }}</p>
                <div class="formula-line">
                    <math displaystyle="true">
                        <mi>F</mi><mo>(</mo><mi>P</mi><mo>)</mo><mo>=</mo><mfrac><mn>1</mn><msub><mi>r</mi><mn>1</mn></msub></mfrac>
                        <mo>=</mo><mfrac><mn>1</mn><mn>{{ formatNumber(FIRST_DISTANCE) }}</mn></mfrac>
                        <mo>≈</mo><mn>{{ formatNumber(SINGLE_BALL_POTENTIAL) }}</mn>
                    </math>
                </div>
            </li>
            <li>
                <p>{{ descriptionText('single_ball_step_6') }}</p>
                <div class="formula-line">
                    <math displaystyle="true">
                        <mn>{{ formatNumber(SINGLE_BALL_POTENTIAL) }}</mn><mo>&lt;</mo><mn>{{ formatNumber(THRESHOLD) }}</mn>
                    </math>
                </div>
            </li>
        </ol>
        <figure>
            <MetaballFieldDiagram :balls="SINGLE_BALL" :threshold="THRESHOLD" :point="TEST_POINT" :description="descriptionText('single_ball_figure_alt')" />
            <figcaption>{{ descriptionText('single_ball_figure_caption') }}</figcaption>
        </figure>

        <h4>{{ descriptionText('two_balls_heading') }}</h4>
        <ol class="example-steps">
            <li>
                <p>{{ descriptionText('two_balls_step_1') }}</p>
                <div class="formula-line">
                    <math displaystyle="true">
                        <mi>F</mi><mo>(</mo><mi>p</mi><mo>)</mo><mo>=</mo>
                        <mfrac><mn>1</mn><msub><mi>r</mi><mn>1</mn></msub></mfrac><mo>+</mo><mfrac><mn>1</mn><msub><mi>r</mi><mn>2</mn></msub></mfrac><mo>,</mo>
                        <mspace width="1.5em" />
                        <msub><mi>r</mi><mn>2</mn></msub><mo>=</mo><mo>‖</mo><mi>p</mi><mo>−</mo><msub><mi>c</mi><mn>2</mn></msub><mo>‖</mo>
                    </math>
                </div>
            </li>
            <li>
                <p>{{ descriptionText('two_balls_step_2') }}</p>
                <div class="formula-line">
                    <DistanceCalculation :point="TEST_POINT" :center="SECOND_BALL" :center_index="2" />
                </div>
            </li>
            <li>
                <p>{{ descriptionText('two_balls_step_3') }}</p>
                <div class="formula-line">
                    <math displaystyle="true">
                        <mi>F</mi><mo>(</mo><mi>P</mi><mo>)</mo>
                        <mo>=</mo><mfrac><mn>1</mn><mn>{{ formatNumber(FIRST_DISTANCE) }}</mn></mfrac>
                        <mo>+</mo><mfrac><mn>1</mn><mn>{{ formatNumber(SECOND_DISTANCE) }}</mn></mfrac>
                        <mo>≈</mo><mn>{{ formatNumber(TWO_BALLS_POTENTIAL) }}</mn>
                    </math>
                </div>
            </li>
            <li>
                <p>{{ descriptionText('two_balls_step_4') }}</p>
                <div class="formula-line">
                    <math displaystyle="true">
                        <mn>{{ formatNumber(TWO_BALLS_POTENTIAL) }}</mn><mo>&gt;</mo><mn>{{ formatNumber(THRESHOLD) }}</mn>
                    </math>
                </div>
            </li>
        </ol>
        <p>{{ descriptionText('two_balls_conclusion') }}</p>
        <figure>
            <MetaballFieldDiagram :balls="TWO_BALLS" :threshold="THRESHOLD" :point="TEST_POINT" show_single_circles :description="descriptionText('two_balls_figure_alt')" />
            <figcaption>{{ descriptionText('two_balls_figure_caption') }}</figcaption>
        </figure>
    </section>

    <section>
        <h3>{{ descriptionText('usage_heading') }}</h3>
        <p>{{ descriptionText('usage_text') }}</p>
    </section>
</template>

<style scoped>
h3 {
    margin: 2em 0 0.5em;
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 600;
}

section:first-child h3 {
    margin-top: 0;
}

p {
    margin-top: 0.8em;
}

h4 {
    margin: 1.6em 0 0.4em;
    font-size: 1.05rem;
    font-weight: 600;
}

.example-steps {
    padding-left: 1.4em;
}

.example-steps li {
    margin-top: 0.8em;
}

.example-steps li::marker {
    color: var(--color-text-muted);
}

.falloff-functions {
    display: grid;
    gap: 0.6em;
    margin: 1em 0;
    padding-left: 1.2em;
}

.falloff-functions li {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4em 1em;
}

.falloff-functions .formula {
    min-width: 12em;
    font-size: 1.1em;
}

.falloff-functions span {
    color: var(--color-text-muted);
    font-size: 0.95rem;
}

.formula-line {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: 0.3em;
    margin: 1em 0;
    font-size: 1.15em;
}

math[display='block'] {
    margin: 1em 0;
    font-size: 1.15em;
}

figure {
    margin: 1.5em 0;
}

figcaption {
    margin-top: 0.5em;
    color: var(--color-text-muted);
    font-size: 0.9rem;
}
</style>
