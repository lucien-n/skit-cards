<script>
	import { Skeleton } from '$components/ui/skeleton';
	import { cn } from '$utils';

	const widths = ['w-24', 'w-28', 'w-32', 'w-36', 'w-40', 'w-44'];

	const getWidth = () => {
		return widths[Math.floor(Math.random() * widths.length)];
	};
</script>

<div
	class="relative card p-3 lg:h-40 w-full gap-1 h-full flex flex-col justify-center items-center text-center"
>
	<Skeleton class={cn('h-7', getWidth())} />
	<Skeleton class={cn('h-7', getWidth())} />
	<Skeleton class="w-16 h-4 absolute bottom-1" />
</div>
