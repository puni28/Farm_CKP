package com.farmckp.orchard.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.farmckp.orchard.dto.TreeCreateDTO;
import com.farmckp.orchard.entity.*;
import com.farmckp.orchard.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class TreeControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired OrchardRepository orchardRepository;
    @Autowired TreeRepository treeRepository;

    private Orchard orchard;

    @BeforeEach
    void setUp() {
        orchard = orchardRepository.save(Orchard.builder()
            .name("Test").location("Test").totalRows(5).totalColumns(5).build());
    }

    @Test
    void createTree_shouldReturn201() throws Exception {
        TreeCreateDTO dto = TreeCreateDTO.builder()
            .orchardId(orchard.getId())
            .rowNumber(1).columnNumber(1)
            .variety("Alphonso")
            .status(Tree.TreeStatus.HEALTHY)
            .healthScore(85)
            .build();

        mockMvc.perform(post("/api/trees")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.variety").value("Alphonso"))
            .andExpect(jsonPath("$.healthScore").value(85));
    }

    @Test
    void getTree_shouldReturn200() throws Exception {
        Tree tree = treeRepository.save(Tree.builder()
            .orchard(orchard).rowNumber(1).columnNumber(1)
            .status(Tree.TreeStatus.HEALTHY).healthScore(80).build());

        mockMvc.perform(get("/api/trees/" + tree.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(tree.getId()));
    }

    @Test
    void getTree_notFound_shouldReturn404() throws Exception {
        mockMvc.perform(get("/api/trees/999999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void getDashboard_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/trees/dashboard"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalTrees").exists());
    }
}
