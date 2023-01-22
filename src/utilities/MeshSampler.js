import { Vector3 } from 'three';
import { Vector2 } from 'three';
class MeshSampler
{
  constructor()
  {

  }

  sample(buffer_geometry, sample_count)
  {
    const face_areas = [];

    let min_area = 99999999;

    const vertices = buffer_geometry.getAttribute('position');
    const normals = buffer_geometry.getAttribute('normal');
    const tangents = buffer_geometry.getAttribute('tangent');
    const uvs = buffer_geometry.getAttribute('uv');
    const indices  = buffer_geometry.index;

    const faces = [];

    for (let i = 0; i < indices.count; i += 3)
    {
      const index_0 = indices.array[i + 0];
      const index_1 = indices.array[i + 1];
      const index_2 = indices.array[i + 2];

      const v1 = new Vector3();
      v1.x = vertices.getX(index_0);
      v1.y = vertices.getY(index_0);
      v1.z = vertices.getZ(index_0);

      const v2 = new Vector3();
      v2.x = vertices.getX(index_1);
      v2.y = vertices.getY(index_1);
      v2.z = vertices.getZ(index_1);

      const v3 = new Vector3();
      v3.x = vertices.getX(index_2);
      v3.y = vertices.getY(index_2);
      v3.z = vertices.getZ(index_2);

      const face = {
        a: v1,
        b: v2,
        c: v3
      };

      if (normals)
      {
        const n1 = new Vector3();
        n1.x = normals.getX(index_0);
        n1.y = normals.getY(index_0);
        n1.z = normals.getZ(index_0);

        const n2 = new Vector3();
        n2.x = normals.getX(index_1);
        n2.y = normals.getY(index_1);
        n2.z = normals.getZ(index_1);

        const n3 = new Vector3();
        n3.x = normals.getX(index_2);
        n3.y = normals.getY(index_2);
        n3.z = normals.getZ(index_2);

        const normal = n1.clone().add(n2).add(n3).normalize();
        face.normal = normal;
      }

      if (tangents)
      {
        const n1 = new Vector3();
        n1.x = tangents.getX(index_0);
        n1.y = tangents.getY(index_0);
        n1.z = tangents.getZ(index_0);

        const n2 = new Vector3();
        n2.x = tangents.getX(index_1);
        n2.y = tangents.getY(index_1);
        n2.z = tangents.getZ(index_1);

        const n3 = new Vector3();
        n3.x = tangents.getX(index_2);
        n3.y = tangents.getY(index_2);
        n3.z = tangents.getZ(index_2);

        const tangent = n1.clone().add(n2).add(n3).normalize();
        face.tangent = tangent;
      }
      if (uvs)
      {
        const uv_a = new Vector2();
        uv_a.x = uvs.getX(index_0);
        uv_a.y = uvs.getY(index_0);

        const uv_b = new Vector2();
        uv_b.x = uvs.getX(index_1);
        uv_b.y = uvs.getY(index_1);

        const uv_c = new Vector2();
        uv_c.x = uvs.getX(index_2);
        uv_c.y = uvs.getY(index_2);

        face.uv_a = uv_a;
        face.uv_b = uv_b;
        face.uv_c = uv_c;
      }

      faces.push(face);

      const area = this.get_face_area(face);
      min_area = Math.min(area, min_area);
      face_areas.push(area);
    }

    const normalized_faces_array = this.get_uniform_face_distribution(face_areas, min_area, faces);
    const selected_faces = this.select_random_faces(normalized_faces_array, sample_count);
    const sampled_data = this.sample_data_from_faces(selected_faces);
    return sampled_data;
  }

  sample_data_from_faces(faces)
  {
    const sampled_points = [];
    const sampled_normals = [];
    const sampled_tangents = [];
    const sampled_uvs = [];

    for (let i = 0; i < faces.length; i++)
    {
      const face = faces[i];

      const w1 = Math.random();
      const w2 = Math.random();

      sampled_points.push(this.sample_point_in_face(w1, w2, face.a, face.b, face.c).clone());
      if (face.normal)
      {
        sampled_normals.push(face.normal.clone());
      }
      if (face.tangent)
      {
        sampled_tangents.push(face.tangent.clone());
      }
      if (face.uv_a)
      {
        sampled_uvs.push(this.sample_point_in_face(w1, w2, face.uv_a, face.uv_b, face.uv_c).clone());
      }
    }
    return { points: sampled_points, normals: sampled_normals, tangents: sampled_tangents, uvs: sampled_uvs };
  }

  select_random_faces(faces, amount)
  {
    const selected_faces = [];
    for (let i = 0; i < amount; i++)
    {
      const random = Math.floor(Math.random() * faces.length);
      const selected_face = faces[random];

      selected_faces.push(selected_face);
    }

    return selected_faces;
  }

  get_uniform_face_distribution(face_areas, minimum_area, faces)
  {
    const extended_triangle_indices = [];
    for (let i = 0; i < face_areas.length; i++)
    {
      face_areas[i] /= minimum_area;
      const repetitions_needed = Math.floor(Math.round(face_areas[i]));
      for (let j = 0; j < repetitions_needed; j++)
      {
        extended_triangle_indices.push(faces[i]);
      }
    }
    return extended_triangle_indices;
  }

  get_face_area(face)
  {
    const vec1 = face.b.clone().sub(face.a);
    const vec2 = face.c.clone().sub(face.a);
    return vec1.cross(vec2).length() / 2;
  }

  sample_point_in_face(w1, w2, v1, v2, v3)
  {
    if (w1 + w2 > 1)
    {
      w1 = 1.0 - w1;
      w2 = 1.0 - w2;
    }

    const w3 = 1.0 - (w1 + w2);

    return v1.clone().multiplyScalar(w1).add(v2.clone().multiplyScalar(w2)).add(v3.clone().multiplyScalar(w3));
  }
}

const mesh_sampler = new MeshSampler();
export { mesh_sampler as MeshSampler };
