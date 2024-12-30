import { Meta, Title } from '@solidjs/meta'
import { type Component, For } from 'solid-js'

import { Column, Page, Row, Section } from '~/components/Page'
import ProjectCard from '~/components/ProjectCard'
import Touchable from '~/components/Touchable'
import { LinkButton, LinkIconButton } from '~/components/buttons'

import IconDiscord from '~/assets/icons/discord.svg'
import IconMail from '~/assets/icons/mail.svg'

import { BirthDate } from '~/constants/events'
import Projects from '~/constants/projects'
import Skills from '~/constants/skills'
import Socials from '~/constants/socials'
import { getAge } from '~/utils'

import sharedStyles from '~/styles/shared.module.css'
import styles from './(home).module.scss'

export default (() => {
    const age = getAge(BirthDate)

    return (
        <Page>
            <Title>Orbit (O4bit)</Title>
            <Meta
                name="description"
                content={`I'm a {age}-year-old Back-end Developer and learning Software Developer. I make Back-end
                        APIs and study about software development to make my own piece of great software one day.`}
            />
            <Meta property="og:image" content="/assets/og/ezgif-7-2eaf8a8b05.gif" />
            <Meta property="og:image:width" content="500" />
            <Meta property="og:image:height" content="500" />
            <Meta property="og:image:type" content="image/webp" />
            <Section constrainSize style="padding-block: min(8vh, var(--gap-insanely-large));">
                <Column gap="none" class={sharedStyles.TextChildrenCenter}>
                    <h1 aria-label="Hey there, I'm Palm">
                        <span aria-hidden="true">Hey there, I'm </span>
                        <span
                            aria-hidden="true"
                            style="font-weight: var(--weight-bolder)"
                            class={sharedStyles.GradientText}
                        >
                            Orbit
                        </span>
                        <span aria-hidden="true">!</span>
                    </h1>
                    <p style="text-wrap: balance">
                        I'm a {age}-year-old Back-end Developer and learning Software Developer. I make Back-end
                        APIs and study about software development to make my own piece of great software one day.
                    </p>
                </Column>
                <Row as="ul" data-no-marker="true" gap="md" centerHorizontal wrap aria-label="My socials">
                    <For each={Object.values(Socials)}>
                        {social => (
                            <li>
                                <LinkIconButton
                                    variant="surface-low"
                                    label={social.name}
                                    href={social.href}
                                    icon={social.icon}
                                />
                            </li>
                        )}
                    </For>
                </Row>
            </Section>
            <Section centerHorizontal constrainSize>
                <h2 class={styles.JSXHeadingStart} aria-label="Projects">
                    <span aria-hidden="true">&lt;</span>
                    <span>Projects</span>
                    <span aria-hidden="true">&gt;</span>
                </h2>
                <ul data-no-marker="true" class={styles.ProjectsGrid}>
                    <For each={Projects}>
                        {project => (
                            <li>
                                <ProjectCard {...project} />
                            </li>
                        )}
                    </For>
                </ul>
                <p aria-hidden="true" class={styles.JSXHeadingEnd}>
                    &lt;/Projects&gt;
                </p>
            </Section>
            <Section gap="xs">
                <Column gap="none">
                    <h2>Skillset</h2>
                    <p>These are some of the technologies I know and use regularly.</p>
                </Column>
                <Row as="ul" data-no-marker="true" wrap gap="xs">
                    <For each={Skills}>
                        {skill => (
                            <li class={styles.SkillItem}>
                                <Touchable
                                    as={Row}
                                    asProps={{
                                        gap: 'xs',
                                        as: 'a',
                                        href: skill.link,
                                        target: '_blank',
                                        rel: 'noreferrer',
                                    }}
                                    class={styles.SkillContainer}
                                    centerVertical
                                >
                                    <img
                                        aria-hidden="true"
                                        class={styles.SkillIcon}
                                        draggable="false"
                                        src={skill.icon}
                                        loading="lazy"
                                        alt={`${skill.name} logo`}
                                    />
                                    <span>{skill.name}</span>
                                </Touchable>
                            </li>
                        )}
                    </For>
                </Row>
            </Section>
            <Section>
                <Column gap="none">
                    <h2>Let's chat</h2>
                    <p style="text-wrap: balance">
                        Don't be shy! If you want to know more about me, work with me, or just want to have a little
                        chat, you can always contact me at anytime.
                    </p>
                </Column>
                <Row as="ul" data-no-marker="true" gap="sm" wrap>
                    <li>
                        <LinkButton leadingIcon={IconDiscord} href={Socials.discord.href}>
                            Chat on Discord
                        </LinkButton>
                    </li>
                    <li>
                        <LinkButton variant="secondary" leadingIcon={IconMail} href={Socials.mail.href}>
                            Send an email
                        </LinkButton>
                    </li>
                </Row>
            </Section>
        </Page>
    )
}) satisfies Component
