class MeshSampler 
{
  constructor()
  {

  }

  sample(geometry, sample_count, sample_normals)
  {
    let face_areas = [];


    let min_area = 99999999;
    for(let i=0; i< geometry.faces.length; i++)
    {
        let area = this.get_face_area (geometry.faces[i], geometry.vertices);
        min_area = Math.min(area, min_area);
        face_areas.push(area);
    }

    let normalized_faces_array = this.get_uniform_face_distribution(face_areas, min_area, geometry.faces);
    let selected_faces = this.select_random_faces(normalized_faces_array, sample_count);
    let sampled_data = this.sample_data_from_faces(selected_faces, geometry.vertices, sample_normals);
    return sampled_data;

  }


  sample_data_from_faces(faces, vertices, sample_normals)
  {
      let sampled_points = [];
      let sampled_normals = [];
      for(let i=0; i< faces.length; i++)
      {
          let face = faces[i];

          let w1 = Math.random();
          let w2 = Math.random();

          sampled_points.push(this.sample_point_in_face(w1, w2, vertices[face.a], vertices[face.b], vertices[face.c]).clone());
          if(sampled_normals && face.normal)
            sampled_normals.push(face.normal.clone());
      }
      return {points: sampled_points, normals: sampled_normals};
  }

  select_random_faces(faces, amount)
  {
    let selected_faces = [];
    for(let i=0; i< amount; i++)
    {
      let random = parseInt(Math.random() * (faces.length-1));
      let selected_face = faces[random];

      selected_faces.push(selected_face);
    }

    return selected_faces;
  }

  get_uniform_face_distribution(face_areas, minimum_area, faces)
  {
      let extended_triangle_indices = [];
      for(let i=0; i< face_areas.length; i++)
      {
          face_areas[i] /= minimum_area;
          let repetitions_needed = parseInt(Math.round(face_areas[i]));
          for(let j=0; j< repetitions_needed; j++)
          {
              extended_triangle_indices.push(faces[i]);
          }
      }
      return extended_triangle_indices;
  }

  get_face_area(face, vertices)
  {
    let v1 = vertices[face.a].clone();
    let v2 = vertices[face.b].clone();
    let v3 = vertices[face.c].clone();

    let vec1 = v2.clone().sub(v1);
    let vec2 = v3.clone().sub(v1);
    return vec1.cross(vec2).length()/2;
  }

  sample_point_in_face( w1, w2, v1, v2, v3)
  {
      if(w1+w2 > 1)
      {
          w1 = 1.0 - w1;
          w2 = 1.0 - w2;
      }

      let w3 = 1.0 - (w1+w2);

      return v1.clone().multiplyScalar(w1).add(v2.clone().multiplyScalar(w2)).add(v3.clone().multiplyScalar(w3));
  }
}

const mesh_sampler = new MeshSampler();
module.exports = mesh_sampler;