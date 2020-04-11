#define range 10.0
vec3 pack_position(vec3 position)
{
	vec3 pos = (position/range) * 0.5 + vec3(0.5, 0.5,0.5);
	pos.x = clamp(pos.x, 0.0, 1.0);
	pos.y = clamp(pos.y, 0.0, 1.0);
	pos.z = clamp(pos.z, 0.0, 1.0);
	return pos;
}
vec3 unpack_position(vec3 pos)
{
	return (pos * 2.0 - vec3(1.0, 1.0, 1.0)) * range;
}