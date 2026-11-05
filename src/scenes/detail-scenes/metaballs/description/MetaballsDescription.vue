<script setup>
import { createDescriptionText, formatNumber } from '../../shared/description/description_text.js';
import TryItYourself from '../../shared/description/TryItYourself.vue';
import {
    THRESHOLD, FIRST_BALL, SECOND_BALL, TEST_POINT, SINGLE_BALL, TWO_BALLS, FIRST_DISTANCE, SECOND_DISTANCE, SINGLE_BALL_POTENTIAL, TWO_BALLS_POTENTIAL,
} from './metaball_example.js';
import MetaballFieldDiagram from './MetaballFieldDiagram.vue';
import DistanceCalculation from './DistanceCalculation.vue';
import MathPoint from './MathPoint.vue';

const descriptionText = createDescriptionText('metaballs');

const SCENE_CONTROLS = [
    { folder_key: 'gui.folder.metaballs', label_key: 'gui.metaballs.count', text_key: 'try_count' },
    { folder_key: 'gui.folder.metaballs', label_key: 'gui.metaballs.isolation', text_key: 'try_isolation' },
    { folder_key: 'gui.folder.metaballs', label_key: 'gui.metaballs.spread', text_key: 'try_spread' },
    { folder_key: 'gui.folder.lava_colour', text_key: 'try_colours' },
];
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
                        <msub><mi>r</mi><mn>1</mn></msub><mo>=</mo><mo>‖</mo><mi>p</mi><mo>−</mo><msub><mi>c</mi><mn>1</mn></msub><mo>‖</mo>
                        <mo>=</mo>
                        <mo>‖</mo>
                        <mrow><mo>(</mo><mi>x</mi><mo separator="true">{{ descriptionText('coordinate_separator') }}</mo><mi>y</mi><mo>)</mo></mrow>
                        <mo>−</mo><MathPoint :point="FIRST_BALL" />
                        <mo>‖</mo>
                    </math>
                    <math displaystyle="true">
                        <mo>=</mo>
                        <msqrt>
                            <msup><mrow><mo>(</mo><mi>x</mi><mo>−</mo><mn>0</mn><mo>)</mo></mrow><mn>2</mn></msup>
                            <mo>+</mo>
                            <msup><mrow><mo>(</mo><mi>y</mi><mo>−</mo><mn>0</mn><mo>)</mo></mrow><mn>2</mn></msup>
                        </msqrt>
                        <mo>=</mo>
                        <msqrt><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><msup><mi>y</mi><mn>2</mn></msup></msqrt>
                    </math>
                </div>
                <p>{{ descriptionText('single_ball_step_1_potential') }}</p>
                <div class="formula-line">
                    <math displaystyle="true">
                        <mi>F</mi><mo>(</mo><mi>p</mi><mo>)</mo><mo>=</mo><mfrac><mn>1</mn><msub><mi>r</mi><mn>1</mn></msub></mfrac>
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
                        <mn>1</mn><mo>≥</mo><mn>{{ formatNumber(THRESHOLD) }}</mn><mo>⋅</mo><msub><mi>r</mi><mn>1</mn></msub>
                    </math>
                </div>
            </li>
            <li>
                <p>{{ descriptionText('single_ball_step_4') }}</p>
                <div class="formula-line">
                    <math displaystyle="true">
                        <mfrac><mn>1</mn><mn>{{ formatNumber(THRESHOLD) }}</mn></mfrac><mo>≥</mo><msub><mi>r</mi><mn>1</mn></msub>
                        <mspace width="0.8em" /><mo>⇔</mo><mspace width="0.8em" />
                        <msub><mi>r</mi><mn>1</mn></msub><mo>≤</mo><mfrac><mn>1</mn><mn>{{ formatNumber(THRESHOLD) }}</mn></mfrac><mo>≈</mo><mn>{{ formatNumber(1 / THRESHOLD) }}</mn>
                    </math>
                </div>
            </li>
            <li>
                <p>{{ descriptionText('single_ball_step_5') }}</p>
                <div class="formula-line">
                    <math displaystyle="true">
                        <msqrt><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><msup><mi>y</mi><mn>2</mn></msup></msqrt><mo>≤</mo><mn>{{ formatNumber(1 / THRESHOLD) }}</mn>
                    </math>
                </div>
            </li>
            <li>
                <p>{{ descriptionText('single_ball_step_6') }}</p>
                <div class="formula-line">
                    <DistanceCalculation :point="TEST_POINT" :center="FIRST_BALL" :center_index="1" />
                </div>
            </li>
            <li>
                <p>{{ descriptionText('single_ball_step_7') }}</p>
                <div class="formula-line">
                    <math displaystyle="true">
                        <mi>F</mi><mo>(</mo><mi>P</mi><mo>)</mo><mo>=</mo><mfrac><mn>1</mn><msub><mi>r</mi><mn>1</mn></msub></mfrac>
                        <mo>=</mo><mfrac><mn>1</mn><mn>{{ formatNumber(FIRST_DISTANCE) }}</mn></mfrac>
                        <mo>≈</mo><mn>{{ formatNumber(SINGLE_BALL_POTENTIAL) }}</mn>
                    </math>
                </div>
            </li>
            <li>
                <p>{{ descriptionText('single_ball_step_8') }}</p>
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

    <TryItYourself detail_key="metaballs" :controls="SCENE_CONTROLS" />

    <section>
        <h3>{{ descriptionText('usage_heading') }}</h3>
        <p>{{ descriptionText('usage_text') }}</p>
    </section>
</template>

<style scoped src="../../shared/description/description.css"></style>

<style scoped>
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
</style>
