/*
 * Copyright (c) 2015-2016 The Khronos Group Inc.
 * Copyright (c) 2015-2016 Valve Corporation
 * Copyright (c) 2015-2016 LunarG, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * Fragment shader for cube demo
 */
#version 430
#extension GL_ARB_separate_shader_objects : enable
#extension GL_ARB_shading_language_420pack : enable
layout (set = 0, binding = 1) uniform sampler2D tex[6];
layout (set = 1, binding = 0) buffer debugBuffer_t
{
    vec4 color[1];
    int count;
} debugBuffer;

layout (location = 0) in vec4 texcoord;
layout (location = 1) in vec3 frag_pos;
layout (push_constant) uniform pushConstants {
    uint texture_index;
} u_pc;
layout (location = 0) out vec4 uFragColor;

const vec3 lightDir= vec3(0.424, 0.566, 0.707);

void main() {
   vec3 dX = dFdx(frag_pos);
   vec3 dY = dFdy(frag_pos);
   vec3 normal = normalize(cross(dX,dY));
   float light = max(0.0, dot(lightDir, normal));
   uFragColor = light * texture(tex[u_pc.texture_index], texcoord.xy);
   uFragColor = uFragColor * debugBuffer.color[0];
   atomicAdd(debugBuffer.count,1);
}
