/*import { Meta, Title } from '@solidjs/meta'
import { useParams } from '@solidjs/router'
import { Show, Suspense, createResource, createSignal, lazy, onCleanup, onMount } from 'solid-js'
import { MDXProvider } from 'solid-mdx'
import { format } from 'timeago.js'

import { Column } from '~/components/Page'
import BlogLayout from '~/components/layouts/BlogLayout'

import Posts, { type Post } from '~/constants/posts'
import { combineClassNames, logger, undefinedIf } from '~/utils'

import FourOhFourPage from '~/routes/[...404]'

import sharedStyles from '~/styles/shared.module.css'
import styles from './[...post].module.css'

export default () => {
    const params = useParams<{ post: string }>()

    // This returns a Promise, since this isn't eager
    // which is great, because we don't want to load the post until we know it's needed
    const post = Posts[params.post]
    if (!post) return <FourOhFourPage withoutDocTitle />

    // This is just a silly workaround because the above returns a promise
    // so we can abuse resources to get the info we need
    const [postInfo] = createResource(post, getPostInfo)

    // `await post` has a `default` property, which is why this is possible
    const PostComponent = lazy(() => post())

    return (
        <Show when={postInfo()} fallback={<p>Loading post...</p>}>
            {info => {
                const [formattedTime, setFormattedTime] = createSignal(format(info().posted))

                onMount(() => {
                    const interval = setInterval(() => {
                        logger.debug('Blog', 'Updating posted time...')
                        setFormattedTime(format(info().posted))
                    }, 60e3)
                    onCleanup(() => clearInterval(interval))
                })

                return (
                    <BlogLayout>
                        <Title>{`${info().title} O4bit (Orbit)`}</Title>
                        <Meta name="description" content={info().description} />
                        <div class={styles.Post}>
                            <Column
                                as="header"
                                gap="none"
                                class={combineClassNames(styles.Wrapper, sharedStyles.TextChildrenCenter)}
                            >
                                <Show when={info().image}>
                                    {img => (
                                        <>
                                            <Meta name="twitter:card" content="summary_large_image" />
                                            <Meta name="twitter:image:src" content={img()} />
                                            <img
                                                class={styles.Cover}
                                                src={img()}
                                                style={undefinedIf(
                                                    !info().imageAspectRatio,
                                                    `--comp-aspect-ratio: ${info().imageAspectRatio}`,
                                                )}
                                                alt="Post cover"
                                            />
                                        </>
                                    )}
                                </Show>
                                <div class={sharedStyles.TextChildrenCenter}>
                                    <h1>{info().title}</h1>
                                    <p style="text-wrap: balance">{info().description}</p>
                                </div>
                                <p style="color: var(--neutral-lowest)">posted {formattedTime()}</p>
                            </Column>
                            <hr />
                            <MDXProvider components={{}}>
                                <Suspense>
                                    <PostComponent />
                                </Suspense>
                            </MDXProvider>
                        </div>
                    </BlogLayout>
                )
            }}
        </Show>
    )
}

const getPostInfo = async (post: Promise<Post>) => {
    const { default: _, ...rest } = await post
    return rest
}
