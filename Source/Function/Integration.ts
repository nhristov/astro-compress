/**
 * @module Integration
 *
 */
// TODO: Test this for security
export let System: string;

export default ((...[_Option = {}]: Parameters<Type>) => {
	Object.entries(_Option).forEach(([Key, Value]) =>
		Object.defineProperty(_Option, Key, {
			value:
				Value === true
					? Default[Key as keyof typeof Default]
					: _Option[Key as keyof typeof _Option],
		}),
	);

	const {
		Path,
		Cache,
		Logger,
		Map: _Map,
		Exclude,
		Action,
		CSS,
		HTML,
		Image,
		JavaScript,
		SVG,
		Parser,
	} = Merge(Default, _Option);

	const Paths = new Set<Path>();

	if (typeof Path !== "undefined") {
		if (Array.isArray(Path) || Path instanceof Set) {
			Path.forEach((Path) => Paths.add(Path));
		}
	}

	if (typeof Parser === "object") {
		Object.entries(Parser).forEach(([Key, Value]) =>
			Object.defineProperty(Parser, Key, {
				value: Array.isArray(Value) ? Value : [Value],
			}),
		);
	}

	return {
		name: "@playform/compress-astro",
		hooks: {
			"astro:config:done": async ({
				config: {
					outDir: { pathname },
				},
			}) => {
				System = (await import("path"))
					.parse(pathname)
					.dir.replace(/\\/g, "/");

				if (System.startsWith("/")) {
					System = System.substring(1);
				}
			},
			"astro:build:done": async ({ dir }) => {
				console.log(
					`\n${(await import("kleur/colors")).bgGreen(
						(await import("kleur/colors")).black(" CompressAstro "),
					)}`,
				);

				if (typeof _Map !== "object") {
					return;
				}

				if (!Paths.size) {
					Paths.add(dir);
				}

				if (typeof Cache === "object" && Cache.Search === Search) {
					Cache.Search = dir;
				}

				for (const [File, Setting] of Object.entries({
					CSS,
					HTML,
					Image,
					JavaScript,
					SVG,
				})) {
					if (
						!(Setting && _Map[File]) ||
						typeof Setting !== "object"
					) {
						continue;
					}

					_Action = Merge(
						Action,
						Merge(Action, {
							Wrote: async ({ Buffer, Input }) => {
								switch (File) {
									case "CSS": {
										// TODO: Implement lightningcss
										// console.log(
										// 	(await import("lightningcss"))
										// 		.transform({
										// 			code: (
										// 				await import("buffer")
										// 			).Buffer.from(
										// 				Buffer.toString()
										// 			),
										// 			filename: Input,
										// 			// minify: true,
										// 			sourceMap: false,
										// 		})
										// 		.code.toString()
										// );

										return (await import("csso")).minify(
											Buffer.toString(),
											// @ts-expect-error
											Setting["csso"],
										).css;
									}

									case "HTML": {
										return await (
											await import("html-minifier-terser")
										).minify(
											Buffer.toString(),
											// @ts-expect-error
											Setting["html-minifier-terser"],
										);
									}

									case "JavaScript": {
										return (
											(
												await (
													await import("terser")
												).minify(
													Buffer.toString(),
													// @ts-expect-error
													Setting["terser"],
												)
											).code ?? Buffer
										);
									}

									case "Image": {
										return await (
											await import(
												"../Function/Image/Writesharp.js"
											)
										)
											// @ts-expect-error
											.default(Setting["sharp"], {
												Buffer,
												Input,
											} as Onsharp);
									}

									case "SVG": {
										const { data: Data } = (
											await import("svgo")
										).optimize(
											Buffer.toString(),
											// @ts-expect-error
											Setting["svgo"],
										);

										return Data ?? Buffer;
									}

									default: {
										return Buffer;
									}
								}
							},
							Fulfilled: async ({
								File: Count,
								Info: { Total },
							}) =>
								Count > 0
									? `${(await import("kleur/colors")).green(
											`✓ Successfully compressed a total of ${Count} ${File} ${
												Count === 1 ? "file" : "files"
											} for ${await (
												await import(
													"@playform/file-pipe/Target/Function/Bytes.js"
												)
											).default(Total)}.`,
										)}`
									: false,
						} satisfies Action),
					);

					if (File === "Image") {
						_Action = Merge(_Action, {
							Read: async ({ Input }) => {
								const { format } =
									await Defaultsharp(Input).metadata();

								return Defaultsharp(Input, {
									failOn: "error",
									sequentialRead: true,
									unlimited: true,
									animated:
										// biome-ignore lint/nursery/noUselessTernary:
										format === "webp" || format === "gif"
											? true
											: false,
								});
							},
						} satisfies Action);
					}

					for (const Path of Paths) {
						await (
							await (
								await (
									await new (
										await import("@playform/file-pipe")
									).default(Cache, Logger).In(Path)
								).By(_Map[File] ?? "**/*")
							).Not(Exclude)
						).Pipe(_Action);
					}
				}
			},
			// @TODO: Finish this
			// "astro:config:setup": ({ addMiddleware }) => {
			// 	addMiddleware();
			// },
		},
	};
}) satisfies Type as Type;

import type Onsharp from "../Interface/Image/Onsharp.js";
import type Type from "../Interface/Integration.js";

import type Action from "@playform/file-pipe/Target/Interface/Action.js";
import type Path from "@playform/file-pipe/Target/Type/Path.js";

export const { default: Default } = await import("../Variable/Option.js");

export const {
	default: {
		Cache: { Search },
	},
} = await import("@playform/file-pipe/Target/Variable/Option.js");

export const { default: Merge } = await import("../Function/Merge.js");

export const { default: Defaultsharp } = await import("sharp");

Defaultsharp.cache(false);

export let _Action: Action;
