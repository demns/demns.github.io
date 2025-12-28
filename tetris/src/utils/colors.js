export function getRandomColor() {
	// Bright, vibrant Tetris colors
	const colors = [
		0xFF6B6B, // Coral red
		0x4ECDC4, // Turquoise
		0xFFE66D, // Yellow
		0x95E1D3, // Mint green
		0xF38181, // Pink
		0xAA96DA, // Purple
		0xFCACA3, // Peach
		0x00D9FF, // Cyan
		0xFF9A76, // Orange
		0xB4F8C8  // Light green
	];
	return colors[Math.floor(Math.random() * colors.length)];
}