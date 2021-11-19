import { Vector3 } from 'three';
class MeshSampler
{
  constructor()
  {

  }

  sample(buffer_geometry, sample_count)
  {
    let face_areas = [];

    let min_area = 99999999;

    let vertices = buffer_geometry.getAttribute('position');
    let normals = buffer_geometry.getAttribute('normal');
    let indices  = buffer_geometry.index;

    let faces = [];

    for (let i = 0; i < indices.count; i += 3)
    {
      let index_0 = indices.array[i + 0];
      let index_1 = indices.array[i + 1];
      let index_2 = indices.array[i + 2];

      let v1 = new Vector3();
      v1.x = vertices.getX(index_0);
      v1.y = vertices.getY(index_0);
      v1.z = vertices.getZ(index_0);

      let v2 = new Vector3();
      v2.x = vertices.getX(index_1);
      v2.y = vertices.getY(index_1);
      v2.z = vertices.getZ(index_1);

      let v3 = new Vector3();
      v3.x = vertices.getX(index_2);
      v3.y = vertices.getY(index_2);
      v3.z = vertices.getZ(index_2);

      let face = {
        a: v1,
        b: v2,
        c: v3
      };

      if (normals)
      {
        let n1 = new Vector3();
        n1.x = normals.getX(index_0);
        n1.y = normals.getY(index_0);
        n1.z = normals.getZ(index_0);

        let n2 = new Vector3();
        n2.x = normals.getX(index_1);
        n2.y = normals.getY(index_1);
        n2.z = normals.getZ(index_1);

        let n3 = new Vector3();
        n3.x = normals.getX(index_2);
        n3.y = normals.getY(index_2);
        n3.z = normals.getZ(index_2);

        let normal = n1.clone().add(n2).add(n3).normalize();
        face.normal = normal;
      }

      faces.push(face);

      let area = this.get_face_area(face);
      min_area = Math.min(area, min_area);
      face_areas.push(area);
    }

    let normalized_faces_array = this.get_uniform_face_distribution(face_areas, min_area, faces);
    let selected_faces = this.select_random_faces(normalized_faces_array, sample_count);
    let sampled_data = this.sample_data_from_faces(selected_faces);
    return sampled_data;
  }

  sample_data_from_faces(faces)
  {
    let sampled_points = [];
    let sampled_normals = [];
    for (let i = 0; i < faces.length; i++)
    {
      let face = faces[i];

      let w1 = Math.random();
      let w2 = Math.random();

      sampled_points.push(this.sample_point_in_face(w1, w2, face.a, face.b, face.c).clone());
      if (face.normal)
      {
        sampled_normals.push(face.normal.clone());
      }
    }
    return { points: sampled_points, normals: sampled_normals };
  }

  select_random_faces(faces, amount)
  {
    let selected_faces = [];
    for (let i = 0; i < amount; i++)
    {
      let random = Math.floor(Math.random() * faces.length);
      let selected_face = faces[random];

      selected_faces.push(selected_face);
    }

    return selected_faces;
  }

  get_uniform_face_distribution(face_areas, minimum_area, faces)
  {
    let extended_triangle_indices = [];
    for (let i = 0; i < face_areas.length; i++)
    {
      face_areas[i] /= minimum_area;
      let repetitions_needed = Math.floor(Math.round(face_areas[i]));
      for (let j = 0; j < repetitions_needed; j++)
      {
        extended_triangle_indices.push(faces[i]);
      }
    }
    return extended_triangle_indices;
  }

  get_face_area(face)
  {
    let vec1 = face.b.clone().sub(face.a);
    let vec2 = face.c.clone().sub(face.a);
    return vec1.cross(vec2).length() / 2;
  }

  sample_point_in_face(w1, w2, v1, v2, v3)
  {
    if (w1 + w2 > 1)
    {
      w1 = 1.0 - w1;
      w2 = 1.0 - w2;
    }

    let w3 = 1.0 - (w1 + w2);

    return v1.clone().multiplyScalar(w1).add(v2.clone().multiplyScalar(w2)).add(v3.clone().multiplyScalar(w3));
  }
}

export default new MeshSampler();
